import express from 'express';
import session from 'express-session';
import mongodb from 'mongodb';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import crypto from 'crypto'
import { createNanoEvents } from 'nanoevents';

import "dotenv/config";

import names from './names'

const app = express();

const emitter = createNanoEvents();
const { MongoClient, ObjectId } = mongodb;

app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.URI, { useUnifiedTopology: true });

(async () => {
  await client.connect();
  const cardsCollection = client.db(process.env.DB_NAME).collection('cards');
  const answersCollection = client.db(process.env.DB_NAME).collection('answers');

  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      client,
      dbName: process.env.DB_NAME,
    }),
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }));

  // Выравнивание вероятности
  // Объект хранящий вероятности с которой карта каждого участника отбрасывается
  const dropProb = {};
  cardsCollection.aggregate([
    {
      $group: {
        _id: '$name',
        count: {
          $sum: 1,
        },
      },
    },
  ]).toArray().then((memeCount) => {
    cardsCollection.countDocuments().then((totalCount) => {
      let quotaTimes;

      const quota = totalCount / memeCount.length; // Квота мемов на человека
      console.log(`${totalCount} мемов всего. Квота: ${quota}`);

      function activeUsers() {
        let count = 0;
        memeCount.forEach((person) => {
          if (person.count > quota / 10) { count += 1; }
        });
        return count;
      }

      memeCount.forEach((person) => {
        // Во сколько раз превышена квота:
        // (колич. астивных человек в конфе * колич. мемов данного человека / мемов всего)
        quotaTimes = activeUsers() * (person.count / totalCount);
        if (quotaTimes > 1) {
          dropProb[person._id] = 1 - (1 / quotaTimes);
        } else {
          dropProb[person._id] = 0;
        }
        console.log(`${person._id} [${person.count}]: ${dropProb[person._id]}`);
      });
    });
  });

  async function drawCard() {
    let card;
    // Тянем карты и отбрасываем их в соответствии с их вероятностью отбрасывания
    do {
      /* eslint-disable no-await-in-loop */
      card = await cardsCollection.aggregate([
        {
          $sample: { size: 1 },
        }, {
          $unset: ['link', 'date'],
        },
      ]).toArray();
      /* eslint-enable no-await-in-loop */
      [card] = card;
    } while (Math.random() < dropProb[card.name]);
    return card;
  }

  let players = {}
  let score = {}
  let card = await drawCard()
  let oldCard = null;
  let answers = 0

  app.post('/api/auth', async (req, res) => {
    const { pass, username } = req.body;

    if (username && !Object.keys(players).includes(username)) {
      players[username] = null;
      emitter.emit('connection', Object.keys(players))
    }

    if (pass && pass.toLowerCase() === process.env.PASSWORD) {
      req.session.loggedIn = true;
      return res.status(200).send('Logged in');
    } else {
      return res.status(401).send('Wrong password');
    }
  });

  app.get('/api/card', async (req, res) => {
    if (!req.session.loggedIn) {
      return res.status(403).send();
    }

    return res.status(200).send({
      ...card,
      name: undefined
    });
  });

  app.get('/api/meme', async (req, res) => {
    const amount = Number(req.query.amount) || 1;
    try {
      let cards = await cardsCollection.aggregate([{ $sample: { size: amount } }]).toArray();
      // Удаляем конфиденциальную информацию
      cards = cards.map((card) => card.image);
      res.status(200).send(cards);
    } catch (e) {
      console.log(`Error: ${e}`);
      res.status(500).send();
    }
  });

  app.post('/api/answer', async (req, res) => {
    if (!req.session.loggedIn) {
      return res.status(403).send();
    }

    if (!req.body.data.id || !req.body.data.name || !req.body.data.username) {
      return res.status(400).send();
    }

    const card = await cardsCollection.findOne({ _id: ObjectId(req.body.data.id) });
    if (!card) {
      return res.status(500).send();
    }

    const correct = card.name === req.body.data.name;
    if (correct) {
      req.session.right += 1;
    } else {
      req.session.wrong += 1;
    }
    answersCollection.insertOne({
      correct,
      selected: req.body.data.name,
    });

    players[req.body.data.username] = req.body.data.name;
    answers += 1
    emitter.emit('answer', {
      username: req.body.data.username,
      selected: req.body.data.name
    });

    // return res.status(200).send({
    //   correct,
    //   card,
    // });
    return res.status(200).send()
  });

  app.get('/api/score', (req, res) => {
    if (req.session.loggedIn) {
      req.session.right = req.session.right || 0;
      req.session.wrong = req.session.wrong || 0;
      const scoreObj = {
        right: req.session.right,
        wrong: req.session.wrong,
      };
      res.status(200).send(scoreObj);
    } else {
      res.status(403).send();
    }
  });

  app.get('/api/stats', async (req, res) => {
    if (!req.session.loggedIn) {
      return res.status(403).send();
    }

    const stats = await answersCollection.aggregate([
      {
        $group: {
          _id: '$selected',
          correct: {
            $sum: {
              $cond: [
                '$correct', 1, 0,
              ],
            },
          },
          wrong: {
            $sum: {
              $cond: [
                '$correct', 0, 1,
              ],
            },
          },
        },
      },
    ]).toArray();

    return res.status(200).send(stats);
  });

  app.get('/api/options', async (req, res) => {
    if (req.session.loggedIn) {
      res.status(200).send(names);
    } else {
      res.status(403).send();
    }
  });

  app.get('/api/players', async (req, res) => {
    if (!req.session.loggedIn) {
      return res.status(403).send();
    }

    return res.status(200).send(Object.keys(players));
  })

  app.post('/api/end', async (req, res) => {
    if (!req.session.loggedIn) {
      return res.status(403).send();
    }

    players = {}
    return res.status(200).send();
  });

  app.get('/api/stream', async (req, res) => {
    const id = crypto.randomUUID()

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });
    res.flushHeaders();

    emitter.on('connection', (players) => {
      const data = players
      res.write(`data: ${JSON.stringify(data)}\nevent: userlist\n\n`);
    })

    emitter.on('answer', async ({
      username, selected
    }) => {
      const data = { 
        username,
        players,
        selected
      }

      res.write(`data: ${JSON.stringify(data)}\nevent: answer\n\n`);

      if (answers === Object.keys(players).length) {
        Object.keys(players).forEach((key) => {
          if (card.name === players[key]) {
            score[key] = (score[key] ?? 0) + 1
          }
        })

        Object.keys(players).forEach((key) => {
          players[key] = null
        })
        answers = 0
        oldCard = { ...card }
        card = await drawCard()
        
        emitter.emit(`allDone-${id}`);
      }
    });

    const unbindAllDone = emitter.on(`allDone-${id}`, () => {
      const data = {
        correctAnswer: oldCard.name,
        score
      }
      res.write(`data: ${JSON.stringify(data)}\nevent: reveal\n\n`);
    });

    res.on('close', () => {
      res.end();
    });
  });

  app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));
})();
