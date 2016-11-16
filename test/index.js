//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

chai.use(chaiHttp)

let Messages = require('../models').Messages

describe('Index', () => {
  describe('/GET /', () => {
    it('should return a greeting', (done) => {
      chai.request(server).get('/').end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('string')
        res.body.should.equal('Leo: Hello World!')
        done()
      })
    })
  })
})