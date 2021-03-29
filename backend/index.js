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
      let card = await client.db(process.env.DB_NAME).collection('cards').aggregate([{ $sample: { size: 1 } }]).toArray()
      card = card[0]
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
      client.db(process.env.DB_NAME).collection('answers').insertOne(req.body.data)
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