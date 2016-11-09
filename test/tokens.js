// //Require the dev-dependencies
// let chai = require('chai')
// let chaiHttp = require('chai-http')
// let server = require('../index')
// let should = chai.should()

// chai.use(chaiHttp)

// let Messages = require('../models').Tokens

// describe('Tokens', () => {
//   afterEach((done) => {
//     Messages.truncate().then((count) => {
//       done()
//     })
//   })

//   describe('/GET tokens', () => {
//     it('should GET all tokens', (done) => {
//       chai.request(server).get('/tokens').end((err, res) => {
//         res.should.have.status(200)
//         res.body.should.be.a('array')
//         res.body.length.should.be.eql(0)
//         done()
//       })
//     })
//   })

//   describe('/POST messages', () => {
//     it('should return a newly created message object', (done) => {
//       let data = { userId: 123, text: "Some random text" }

//       chai.request(server)
//         .post('/messages')
//         .send(data)
//         .end((err, res) => {
//           res.should.have.status(201)
//           res.body
//             .should.be.a('object')
//             .and.to.include.keys('id', 'userId', 'text', 'updatedAt', 'createdAt')
//           done()
//         })
//     })

//     it('should return an array of error messages if validation fails', (done) => {
//       let data = { userId: 'Non numeric ID', text: null }

//       chai.request(server)
//         .post('/messages')
//         .send(data)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.to.deep.equal([
//             { type: 'notNull Violation', field: 'text', value: null, text: 'text cannot be null' },
//             { type: 'Validation error', field: 'userId', value: 'Non numeric ID', text: 'Validation isNumeric failed' }
//           ])
//           done()
//         })
//     })
//   })

// })