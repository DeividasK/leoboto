//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

chai.use(chaiHttp)

let Messages = require('../models').Messages

describe('Messages', () => {
  describe('/GET messages', () => {
    it('should GET all the messages', (done) => {
      chai.request(server).get('/messages').end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(0)
        done()
      })
    })
  })

  describe('/POST messages', () => {

    afterEach((done) => {
      Messages.truncate().then((count) => {
        done()
      })
    })

    it('should return a newly created message object', (done) => {

      let data = { mId: 'Unique message ID', senderId: 1234, recipientId: 9876, data: "test" }

      chai.request(server)
        .post('/messages')
        .send(data)
        .end((err, res) => {
          res.should.have.status(201)
          res.body
            .should.be.a('object')
            .and.to.include({ 'mId': 'Unique message ID', 'senderId': '1234', 'recipientId': '9876', 'data': 'test' })
            .and.to.include.keys('timestamp', 'id', 'seq')
          done()
        })
    })

    it('should return an array of error messages if validation fails', (done) => {
      let data = { mId: 'Unique message ID', senderId: 'not a number', recipientId: 9876 }

      chai.request(server)
        .post('/messages')
        .send(data)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('array')
          res.body.should.to.deep.equal([
            { type: 'notNull Violation', field: 'data', text: 'data cannot be null' },
            { type: 'Validation error', field: 'senderId', text: 'Validation isNumeric failed' }
          ])
          done()
        })
    })

    xit("should store bot messages with 'autoResponse' set to true", () => {
      
    })
  })

})