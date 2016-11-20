"use strict"

const chai      = require('chai')
const sinon     = require('sinon')
const graph     = require('fbgraph')

const should    = chai.should()
const expect    = chai.expect

let Facebook = require('../utilities/Facebook')

describe('Facebook', () => {
  let stub

  beforeEach(() => {
    stub = sinon.stub(graph, 'post')
  })

  afterEach(() => {
    stub.restore()
  })

  xit("should throw and error if application access token is not set (the default is left unchanged)", () => {

  })

  it("should have a 'sendMessage' method", () => {
    expect(Facebook.sendMessage).to.be.a('function')
  })

  it("should send a response with a provided query", () => {
    Facebook.sendMessage('hello, world!')

    expect(stub.callCount).to.equal(1)
    expect(stub.args[0][1].message.text).to.equal('hello, world!')
  })

  it("should add autoResponse 'metadata' to the message", () => {
    Facebook.sendMessage('hello, world!')

    expect(stub.args[0][1].metadata).to.equal(JSON.stringify({ autoResponse: true}))
  })

  xit("should send a random ambiguous response if the query contains a question mark", () => {

  })

  xit("should send a response with a question mark if the query does not contain a question mark, i.e. it is not a question", () => {

  })
})