require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');


router
  .get('/test', (req, res) => res.json({ msg: 'Profile Works' }))

  .get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const errors = {};

    Profile.findOne({ user: req.user._id })
      .then(profile => {
        if(!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(next);
  });

module.exports = router;