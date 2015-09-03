var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var passport = require('passport');
var auth = require('../lib/auth');
var middlewares = require('../lib/middlewares');
var UserSession = require('../models/user-session');
var router = express.Router();

router.get('/', function(req, res) {
  var rd = req.query.rd || '/dashboard';

  // login successful
  if (req.user) {
    if (!req.session._form) {
      res.flash('warning', 'You are already logged in');
      return res.redirect(rd);
    }
    var done = function() {
      res.flash('info', 'You are now logged in');
      res.redirect(rd);
    };
    var remember = req.session._form.remember;
    delete req.session._form;
    if (remember) {
      return UserSession.generateRememberToken(req.user, function(err, token) {
        if (!err) {
          res.cookie(auth.REMEMBER_ME_COOKIE, token, {
            httpOnly: true,
            maxAge: 31536000000
          });
        }
        done();
      });
    }
    return done();
  }

  // show login form
  var inputs = {};
  var errors = {};
  if (req.session._form) {
    inputs = req.session._form.inputs || {};
    errors = req.session._form.errors || {};
    delete req.session._form;
  }
  inputs.rd = rd;
  res.render('index-login', {
    title: __('Login'),
    navbar: {
      selected: 'login'
    },
    sidebar: {
      type: 'login',
      selected: 'login'
    },
    inputs: inputs || {},
    errors: errors || {}
  });

});

router.post('/', [

  middlewares.mustNotLoggedIn,

  // form validation
  function(req, res, next) {
    var login = req.body.login || '';
    var password = req.body.password || '';
    var remember = parseInt(req.body.remember || 0) == 1;
    var errors = {};
    if (login.length === 0) {
      errors.login = 'Login ID is required';
    } else {
      if (login.indexOf('@') != -1) {
        if (!iz.email(login)) {
          errors.login = 'Invalid email';
        }
      } else {
        if (login.length < 3) {
          errors.login = 'Username too short';
        }
        else if (login.length > 64) {
          errors.login = 'Username too long';
        }
      }
    }
    if (password.length < 5) {
      if (password.length === 0) {
        errors.password = 'Password is required';
      } else {
        errors.password = 'Password too short';
      }
    }
    else if (password.length > 32) {
      errors.password = 'Password too long';
    }
    if (Object.keys(errors).length === 0) {
      req.session._form = {
        remember: remember
      };
      next();
    } else {
      req.session._form = {
        inputs: {
          login: login
        },
        errors: errors
      };
      res.redirect('/login');
    }
  },

  // process login
  passport.authenticate('local', {
    successRedirect: '/login',
    failureRedirect: '/login'
  })

]);

module.exports = router;