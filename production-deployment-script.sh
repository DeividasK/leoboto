#!/bin/bash
cd leoboto;
git pull;
npm install --production;
sequelize db:migrate;
forever restart index.js;
exit