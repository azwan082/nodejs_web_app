var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var passport = require('passport');
var auth = require('../lib/auth');
var UserSession = require('../models/user-session');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.user) {
    var done = function() {
      res.flash('info', 'You are now logged in');
      res.redirect('/settings');
    };
    var remember = req.session._remember;
    delete req.session._form;
    delete req.session._remember;
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
  var inputs = {};
  var errors = {};
  if (req.session._form) {
    inputs = req.session._form.inputs || {};
    errors = req.session._form.errors || {};
    delete req.session._form;
  }
  render(res, {
    inputs: inputs,
    errors: errors
  });
});

router.post('/', [

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
      req.session._remember = remember;
      next();
    } else {
      render(res, {
        inputs: {
          login: login
        },
        errors: errors
      });
    }
  },

  // process login
  passport.authenticate('local', {
    successRedirect: '/login',
    failureRedirect: '/login'
  })

]);

function render(res, arg) {
  arg = arg || {};
  res.render('index-login', {
    title: __('Login'),
    navbar: {
      selected: 'login'
    },
    inputs: arg.inputs || {},
    errors: arg.errors || {}
  });
}

module.exports = router;