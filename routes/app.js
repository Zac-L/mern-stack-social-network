const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));


// ### Required routes ### //
const users = require('./api/users');
const profile = require('./api/profile');
const posts = require('./api/posts');

// ### Used routes ### //
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

module.exports = app;