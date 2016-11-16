"use strict"

const fs        = require("fs")
const path      = require("path")
const routes    = {}

// Read all files in routes folder and add them to the 'routes' object
fs.readdirSync(__dirname)
  .filter((file) => { return (file.indexOf(".") !== 0) && (file !== "index.js") && (file !== "routes.js") })
  .forEach((file) => {
    let filename = file.replace('.js', '')
    routes[filename] = require('./' + file)
  })

module.exports = routes