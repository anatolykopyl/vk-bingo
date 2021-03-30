const express = require('express')
const session = require('express-session')
const app = express()
const {MongoClient} = require('mongodb')
const MongoStore = require('connect-mongo')
const cors = require('cors')
require('dotenv').config()

app.use(cors({
  origin: [
    process.env.FRONTEND
  ],
  credentials: true,
  exposedHeaders: ['set-cookie']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const names = require('./names.json')
const client = new MongoClient(process.env.URI, { useUnifiedTopology: true })

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    client,
    dbName: process.env.DB_NAME
  }),
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

client.connect()
const cardsCollection = client.db(process.env.DB_NAME).collection('cards')
const answersCollection = client.db(process.env.DB_NAME).collection('answers')

// Выравнивание вероятности
let dropProb = {} // Объект хранящий вероятности с которой карта каждого участника отбрасывается
cardsCollection.aggregate([
  {
    '$group': {
      '_id': '$name', 
      'count': {
        '$sum': 1
      }
    }
  }
]).toArray().then((memeCount) => {
  cardsCollection.countDocuments().then((totalCount) => {
    let quota, quotaTimes
    quota = totalCount/memeCount.length  // Квота мемов на человека
    console.log(totalCount + " мемов всего. Квота: " + quota)
    memeCount.forEach((n) => {
      // Во сколько раз превышена квота:
      // (колич. человек в конфе * колич. мемов данного человека / мемов всего)
      quotaTimes = memeCount.length*n.count/totalCount
      if (quotaTimes > 1) {
        dropProb[n._id] = 1 - (1/quotaTimes)
      } else {
        dropProb[n._id] = 0
      }
      console.log(n._id + " ["+n.count+"]: " + dropProb[n._id])
    })
  })
})

app.post('/auth', async (req, res) => {
  if (req.session.loggedIn) {
    res.status(200).send("Logged in")
  } else {
    try {
      const pass = req.body.pass
      if (pass && pass.toLowerCase() === process.env.PASSWORD) {
        req.session.loggedIn = true
        res.status(200).send("Logged in")
      } else {
        res.status(401).send("Wrong password")
      }
    } catch (e) {
      console.log("Error: " + e)
      res.status(500).send()
    }
  }
})

app.get('/card', async (req, res) => {
  if (req.session.loggedIn) {
    try {
      let card
      // Тянем карты и отбрасываем их в соответствии с их вероятностью отбрасывания
      do {
        card = await cardsCollection.aggregate([{ $sample: { size: 1 } }]).toArray()
        card = card[0]
      } while (Math.random() < dropProb[card.name])
      res.status(200).send(card)
    } catch (e) {
      console.log("Error: " + e)
      res.status(500).send()
    }
  } else {
    res.status(403).send()
  }
})

app.post('/answer', (req, res) => {
  if (req.session.loggedIn) {
    try {
      answersCollection.insertOne(req.body.data)
      res.status(200).send()
    } catch (e) {
      console.log("Error: " + e)
      res.status(500).send()
    }
  } else {
    res.status(403).send()
  }
})

app.get('/options', async (req, res) => {
  if (req.session.loggedIn) {
    res.status(200).send(names)
  } else {
    res.status(403).send()
  }
})

app.listen(process.env.PORT)