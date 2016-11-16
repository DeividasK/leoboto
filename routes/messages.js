const winston = require('winston')
const db = require('../models').Messages

class Messages {
  constructor () {
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
  }

  get (req, res) {
    db.findAll().then((messages) => {
      res.status(200).json(messages)
    })
  }

  post (req, res) {
    db.create(req.body)
      .then((message) => {
        res.status(201).json(message)
      })
      .catch((data) => {
        let errors = []

        data.errors.forEach((error) => {
          errors.push({ type: error.type, text: error.message, field: error.path })
        })

        res.status(422).json(errors)

        winston.error('Data validation failed', errors)
      })
  }
}

module.exports = new Messages()