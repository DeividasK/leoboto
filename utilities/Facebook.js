"use strict"

const config = require('config')
const graph = require('fbgraph')

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

    graph.post("/messages", data)
  }
}

module.exports = new Facebook()