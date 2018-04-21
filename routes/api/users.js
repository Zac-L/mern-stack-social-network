require('dotenv').config();
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Input Validation
const validateRegisterInput = require('../../validation/register');

// User Model
const User = require('../../models/User');

router
  .get('/test', (req, res) => res.json({ msg: 'Users Works' }))


  .post('/register', (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Validation check
    if(!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
      .then(user => {
        if(user) {
          errors.email = 'Email already exists';
          return res.status(400).json(errors);
        } 
        else {
          const avatar = gravatar.url(req.body.email, {
            size: '200',
            rating: 'pg',
            default: 'mm'
          });

          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              
              newUser.save()
                .then(user => res.json(user))
                .catch(next);
            });
          });
        }
      });
  })

  .post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
      .then(user => {
        if(!user) {
          return res.status(404).json({ email: 'User not found' });
        }

        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if(isMatch) {
              // User Matched
              const payload = { _id: user._id, name: user.name, avatar: user.avatar };

              // Signed Token
              jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
            }
            else {
              return res.status(400).json({ password: 'Password incorrect' });
            }
          });
      });
  })

  .get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  });

module.exports = router;