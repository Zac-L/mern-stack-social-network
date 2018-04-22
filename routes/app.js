const express = require('express');
const morgan = require('morgan');
const errorHandler = require('../utils/error-handler');
const redirectHttp = require('../utils/redirect-http');
const checkDB = require('../utils/checkDB');
const passport = require('passport');
const app = express();

// ### Middleware ### //
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());


// ### Passport config ### //
require('../passport')(passport);

// ### Redirect http to https in production ### //
if(process.env.NODE_ENV === 'production') {
  app.use(redirectHttp);
}

// ### Required routes ### //
const users = require('./api/users');
const profile = require('./api/profile');
const posts = require('./api/posts');

// ### Used routes ### //
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// ### Catchers ### //
app.use(checkDB);
app.use(errorHandler());


module.exports = app;