/* eslint no-console: "off" */
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const defaultUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsocialnetwork';


function connect(dbUri = defaultUri) {
  const promise = mongoose.connect(dbUri);

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection open to ${dbUri}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });

  mongoose.connection.on('error', err => {
    console.log(`Mongoose default connection error ${err}`);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
  return promise;
}

module.exports = connect;

