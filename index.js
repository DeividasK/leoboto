"use strict"

const config    = require('config')
const winston = require('winston')

winston.configure({
  transports: [ new (winston.transports.File)({ filename: 'winston.log' }) ]
});

const db = require('./models')
const routes = require('./routes')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = config.get('app.port')

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

app.get('/', (req, res) => { res.json('Leo: Hello World!') })

// Loop over routes
Object.keys(routes).forEach((route) => {
  // Loop over each route's methods
  Object.getOwnPropertyNames(routes[route]).forEach((method) => {
    // Assign available methods
    app[method]('/' + route, routes[route][method])
  })
})

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    winston.info(`Listening on port ${port}!`)
  })
})

module.exports = app // for testing