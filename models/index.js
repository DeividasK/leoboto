"use strict";

const fs        = require("fs")
const path      = require("path")
const winston   = require('winston')
const Sequelize = require("sequelize")
const config    = require('config').get('db')
const sequelize = new Sequelize(config.database, config.username, config.password, config.options)

let   db        = {}

// Read all files in models folder and add them to the 'db' object
fs.readdirSync(__dirname)
  .filter((file) => { return (file.indexOf(".") !== 0) && (file !== "index.js") })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// Not used at the moment
// Add all assosiactions for each model
Object.keys(db).forEach((modelName) => { if ("associate" in db[modelName]) db[modelName].associate(db) })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db