require('dotenv').config();
const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const passport = require('passport');
const validateProfileInput = require('../../validation/profile');

// Models
const Profile = require('../../models/Profile');
// const User = require('../../models/User');


router
  .get('/test', (req, res) => res.json({ msg: 'Profile Works' }))

  .get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const errors = {};

    Profile.findOne({ user: req.user._id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if(!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(next);
  })

  .post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if(!isValid) {
      return res.status(400).json(errors)
    }

    const profileFields = {};

    profileFields.user = req.user._id;

    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.skills) profileFields.skills = req.body.skills;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - Split into array
    if(typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user._id })
      .then(profile => {
        if(profile) {
          // Update

          Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.json(profile));

        } else {
          // Create

          // Check if handle exists
          Profile.findOne({ handle: profileFields.handle })
            .then(profile => {
              if(profile) {
                errors.handle = 'That handle already exists';
                res.status(400).json(errors);
              }

              // Save Profile
              new Profile(profileFields)
                .save()
                .then(profile => res.json(profile));
            });
        }
      }).catch(next);
  });

module.exports = router;