//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

chai.use(chaiHttp)

let Messages = require('../models').Messages

describe('Webhook', () => {
  describe('/GET webhook', () => {
    it("should return 'Invalid verify token!' if 'hub.verify_token' does not match the value in the config", (done) => {
      chai.request(server).get('/webhook?hub.verify_token=TOKEN_STRING&&hub.challenge=CHALLENGE_STRING').end((err, res) => {
        // console.log(err, res)
        res.should.have.status(200)
        res.text.should.be.a('string')
        res.text.should.equal('Invalid verify token!')
        done()
      })
    })

    it("should return 'hub.challenge' string if 'hub.verify_token' matches the value in the config", (done) => {
      chai.request(server).get('/webhook?hub.verify_token=VERIFY_TOKEN&&hub.challenge=CHALLENGE_STRING').end((err, res) => {
        // console.log(err, res)
        res.should.have.status(200)
        res.text.should.be.a('string')
        res.text.should.equal('CHALLENGE_STRING')
        done()
      })
    })
  })

  describe('/POST webhook', () => {
    afterEach((done) => {
      Messages.truncate().then((count) => {
        done()
      })
    })

    it("should add the message to the database if message is a text", (done) => {
      let data = {
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

      chai.request(server).post('/webhook').send(data).end((err, res) => {
        res.should.have.status(200)
        Messages.findAll().then((messages) => {
          messages.should.be.a('array')
          messages.length.should.be.eql(1)
          done()
        })
      })
    })

    it("should do nothing if message is an attachment", (done) => {
      let data = {
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
                  "mid":"mid.1458696618141:b4ef9d19ec21086067",
                  "seq":51,
                  "attachments":[
                    {
                      "type":"image",
                      "payload":{
                        "url":"IMAGE_URL"
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }

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