const express = require('express');
const morgan = require('morgan');
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


// ### Required routes ### //
const users = require('./api/users');
const profile = require('./api/profile');
const posts = require('./api/posts');

// ### Used routes ### //
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

module.exports = app;