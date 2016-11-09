
const config = require('config')
const winston = require('winston')

winston.configure({
  transports: [ new (winston.transports.File)({ filename: 'winston.log' }) ]
});

const db = require('./models')
const bodyParser = require('body-parser')
const upload = require('multer')() // for parsing multipart/form-data
const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.get('/messages', upload.array(), (req, res) => {
  db.Messages.findAll().then((messages) => {
    res.status(200).json(messages)
  })
})

app.post('/messages', (req, res) => {
  db.Messages.create(req.body)
    .then((message) => { res.status(201).json(message) })
    .catch((data) => {
      let errors = []

      data.errors.forEach((error) => {
        errors.push({ type: error.type, text: error.message, field: error.path })
      })

      res.status(422).json(errors)

      winston.error('Data validation failed', errors)
    })
})

// Facebook Webhook listener
app.get('/webhook', function (req, res) {
  let response = (req.query['hub.verify_token'] === config.get('facebook.verifyToken')) ? req.query['hub.challenge'] : 'Invalid verify token'
  res.status(200).send(response)
})

// Facebook Webhook handler
app.post('/webhook', function (req, res) {
  let events = req.body.entry[0].messaging

  events.forEach((event) => {
    if (event.message && event.message.text) {
      db.Messages.create({
        mId: event.message.mid,
        senderId: event.sender.id,
        recipientId: event.recipient.id,
        timestamp: event.timestamp,
        seq: event.message.seq,
        data: event.message.text
      })
    }
  })

  res.sendStatus(200)
})

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    winston.info('Listening on port 3000!')
  })
})

module.exports = app // for testing