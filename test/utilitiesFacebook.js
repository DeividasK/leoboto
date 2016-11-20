"use strict"

const chai      = require('chai')
const sinon     = require('sinon')
const graph     = require('fbgraph')

const should    = chai.should()
const expect    = chai.expect

let Facebook = require('../utilities/Facebook')

describe('Facebook', () => {
  it("should have a method 'sendMessage'", () => {
    expect(Facebook.sendMessage).to.be.a('function')
  })

  describe(".sendMessage", () => {
    let stub

    beforeEach(() => {
      stub = sinon.stub(graph, 'post')
      Facebook.sendMessage('hello, world!')
    })

    afterEach(() => {
      stub.restore()
    })

    it("should send a message with a provided query", () => {
      expect(stub.callCount).to.equal(1)
      expect(stub.args[0][1].message.text).to.equal('hello, world!')
    })

    it("should add autoResponse 'metadata' to the message", () => {
      expect(stub.args[0][1].message.metadata).to.equal(JSON.stringify({ autoResponse: true}))
    })

    it("should provide a callback for the response from the server", () => {
      expect(stub.args[0][2]).to.be.a('function')
    })

    it("should provide a callback for the response from the server", () => {
      expect(stub.args[0][2]).to.be.a('function')
    })

    xit("should log the server response through winston", () => {

    })
  })

  xit("should throw and error if application access token is not set (the default is left unchanged)", () => {

  })

  xit("should send a random ambiguous response if the query contains a question mark", () => {

  })

  xit("should send a response with a question mark if the query does not contain a question mark, i.e. it is not a question", () => {

  })
})