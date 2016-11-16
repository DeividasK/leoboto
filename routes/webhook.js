const winston = require('winston')
const config = require('config')
const db = require('../models').Messages

class Webhook {
  constructor () {
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
  }

  get (req, res) {
    let response = (req.query['hub.verify_token'] === config.get('facebook.verifyToken'))
      ? req.query['hub.challenge']
      : 'Invalid verify token!'

    return res.status(200).send(response)
  }

  post (req, res) {
    let events = req.body.entry[0].messaging

    events.forEach((event) => {
      if (event.message && event.message.text) {
        db.create({
          mId: event.message.mid,
          senderId: event.sender.id,
          recipientId: event.recipient.id,
          timestamp: event.timestamp,
          seq: event.message.seq,
          data: event.message.text
        })
      }
    })

    return res.sendStatus(200)
  }
}

module.exports = new Webhook()