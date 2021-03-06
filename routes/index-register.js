var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var passport = require('passport');
var middlewares = require('../lib/middlewares');
var router = express.Router();

router.get('/', function(req, res) {
  
  // register successful
  if (req.user) {
    if (req.session._form) {
      delete req.session._form;
      req.flash('success', __('Account successfully created'));
      req.flash('info', __('You are now logged in'));
    } else {
      req.flash('warning', __('You are already registered'));
    }
    return res.redirect('/dashboard');
  }

  // show register form
  var inputs = {};
  var errors = {};
  if (req.session._form) {
    inputs = req.session._form.inputs || {};
    errors = req.session._form.errors || {};
    delete req.session._form;
  }
  res.render('index-register', {
    title: __('Register'),
    navbar: {
      selected: 'login'
    },
    sidebar: {
      type: 'login',
      selected: 'register'
    },
    inputs: inputs || {},
    errors: errors || {}
  });

});

router.post('/', [

  middlewares.mustNotLoggedIn,

  // form validation
  function(req, res, next) {
    var username = req.body.username || '';
    var email = req.body.email || '';
    var password = req.body.password || '';
    var agree = parseInt(req.body.agree || 0) == 1;
    var errors = {};
    if (username.length < 3) {
      if (username.length === 0) {
        errors.username = __('Username is required');
      } else {
        errors.username = __('Username too short');
      }
    }
    else if (username.length > 64) {
      errors.username = __('Username too long');
    }
    if (email.length === 0) {
      errors.email = __('Email is required');
    } else {
      if (!iz.email(email)) {
        errors.email = __('Invalid email');
      }
    }
    if (password.length < 5) {
      if (password.length === 0) {
        errors.password = __('Password is required');
      } else {
        errors.password = __('Password too short');
      }
    }
    else if (password.length > 32) {
      errors.password = __('Password too long');
    }
    if (!agree) {
      errors.agree = true;
    }
    if (req.xhr) {
      return res.json({
        status: 'ok',
        errors: errors
      });
    }
    if (Object.keys(errors).length === 0) {
      next();
    } else {
      req.session._form = {
        inputs: {
          username: username,
          email: email
        },
        errors: errors
      };
      res.redirect('/register');
    }
  },

  // process registration
  passport.authenticate('register', {
    successRedirect: '/register',
    failureRedirect: '/register'
  })

]);

module.exports = router;