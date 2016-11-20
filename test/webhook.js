"use strict"

let chai      = require('chai')
let chaiHttp  = require('chai-http')
let sinon     = require('sinon')

chai.use(chaiHttp)

let server    = require('../index')
let should    = chai.should()
let expect    = chai.expect

let Messages = require('../models').Messages
let Facebook = require('../utilities/Facebook')

describe('Webhook', () => {
  describe('/GET webhook', () => {
    it("should return 'Invalid verify token!' if 'hub.verify_token' does not match the value in the config", (done) => {
      chai.request(server).get('/webhook?hub.verify_token=TOKEN_STRING&&hub.challenge=CHALLENGE_STRING').end((err, res) => {
        res.should.have.status(200)
        res.text.should.be.a('string')
        res.text.should.equal('Invalid verify token!')
        done()
      })
    })

    it("should return 'hub.challenge' string if 'hub.verify_token' matches the value in the config", (done) => {
      chai.request(server).get('/webhook?hub.verify_token=VERIFY_TOKEN&&hub.challenge=CHALLENGE_STRING').end((err, res) => {
        res.should.have.status(200)
        res.text.should.be.a('string')
        res.text.should.equal('CHALLENGE_STRING')
        done()
      })
    })
  })

  describe('/POST webhook', () => {
    let dummy = {
      "object": "page",
      "entry": [
        {
          "id": "588594121342673",
          "time": 1478878411205,
          "messaging": [
            {
              "sender":{ "id":"1335307903155046" },
              "recipient":{ "id":"588594121342673" },
              "timestamp":1458692752478,
              "message":{
                "mid":"mid.1457764197618:41d102a3e1ae206a38",
                "seq":73,
                "text":"hello, world!"
              }
            }
          ]
        }
      ]
    }

    let stub

    beforeEach(() => {
      stub = sinon.stub(Facebook, 'sendMessage')
    })

    afterEach((done) => {
      stub.restore()
      Messages.truncate().then((count) => { done() })
    })

    it("should add the message to the database if message is a text", (done) => {
      chai.request(server).post('/webhook').send(dummy).end((err, res) => {
        res.should.have.status(200)
        Messages.findAll().then((messages) => {
          messages.should.be.a('array')
          messages.length.should.be.eql(1)
          done()
        })
      })
    })

    it("should add the message with autoresponse = true if message was sent automatically", (done) => {
      let data = Object.assign({}, dummy)
      data.entry[0].messaging[0].message.metadata = JSON.stringify({ autoResponse: true })

      chai.request(server).post('/webhook').send(data).end((err, res) => {
        res.should.have.status(200)
        Messages.findAll().then((messages) => {
          expect(messages[0].autoResponse).to.be.true
          done()
        })
      })
    })

    it("should send a response with message text", (done) => {
      chai.request(server).post('/webhook').send(dummy).end((err, res) => {
        res.should.have.status(200)
        expect(stub.calledWith('hello, world!')).to.be.true
        done()
      })
    })

    it("should not send a response if message was sent by a page", (done) => {
      let data = Object.assign({}, dummy)
      data.entry[0].messaging[0].message.is_echo = true

      chai.request(server).post('/webhook').send(data).end((err, res) => {
        res.should.have.status(200)
        expect(stub.calledWith('hello, world!')).to.be.false
        Messages.findAll().then((messages) => {
          messages.should.be.a('array')
          messages.length.should.be.eql(1)
          done()
        })
      })
    })

    it("should do nothing if message is an attachment", (done) => {
      let data = Object.assign({}, dummy)
      data.entry[0].messaging[0].message.text = undefined
      data.entry[0].messaging[0].message.attachments = [
        {
          "type": "image",
          "payload": {
            "url":"IMAGE_URL"
          }
        }
      ]

      chai.request(server).post('/webhook').send(data).end((err, res) => {
        res.should.have.status(200)
        Messages.findAll().then((messages) => {
          messages.should.be.a('array')
          messages.length.should.be.eql(0)
          done()
        })
      })
    })

  })
})