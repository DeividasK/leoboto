"use strict"

const config = require('config')
const graph = require('fbgraph')
const winston = require('winston')

winston.configure({
  transports: [ new (winston.transports.File)({ filename: 'winston.log' }) ]
})

class Facebook {
  constructor () {
    graph.setAccessToken(config.get('facebook.accessToken'))
  }

  sendMessage (query) {
    let data = {
      recipient: { id: "1335307903155046" },
      message: { text: query },
      metadata: JSON.stringify({ autoResponse: true})
    }

    graph.post("/me/messages", data, function(err, res) {
      winston.log(res)
    })
  }
}

module.exports = new Facebook()