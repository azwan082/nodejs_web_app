var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var middlewares = require('../lib/middlewares');
var User = require('../models/user');
var router = express.Router();

router.use(middlewares.mustNotLoggedIn);

router.get('/', function(req, res) {
  var key = req.query.key || '';
  var errors = {};
  var inputs = {};
  if (req.session._form) {
    errors = req.session._form.errors || {};
    inputs = req.session._form.inputs || {};
    delete req.session._form;
  }
  inputs.key = key;
  if (key.length === 0) {
    req.flash('danger', __('Reset key is missing'));
  }
  res.render('index-reset', {
    title: __('Reset password'),
    navbar: {
      selected: 'login'
    },
    sidebar: {
      type: 'login'
    },
    inputs: inputs,
    errors: errors
  });
});

router.post('/', function(req, res) {
  var key = req.body.key || '';
  var email = req.body.email || '';
  var newPassword = req.body.npassword || '';
  var errors = {};
  if (key.length === 0) {
    return res.redirect('/reset');
  }
  if (email.length === 0) {
    errors.email = __('Email is required');
  }
  else if (!iz.email(email)) {
    errors.email = __('Invalid email');
  }
  if (newPassword.length < 5) {
    if (newPassword.length === 0) {
      errors.npassword = __('Password is required');
    } else {
      errors.npassword = __('Password too short');
    }
  }
  else if (newPassword.length > 32) {
    errors.npassword = __('Password too long');
  }

  var onError = function(err) {
    if (err) {
      req.flash('danger', err.message || err);
    }
    req.session._form = {
      inputs: {
        email: email
      },
      errors: errors
    };
    res.redirect('/reset?key=' + key);
  };

  if (Object.keys(errors).length === 0) {
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        return onError(err);
      }
      if (!user) {
        return onError(__('User not found'));
      }
      if (key != user.reset.key) {
        return onError(__('Invalid reset key'));
      }
      if ((Date.now() - user.reset.created.getTime()) > 86400000) { // 1d
        return onError(__('Invalid reset key'));
      }
      user.password = User.hashPassword(newPassword);
      user.reset = {};
      user.save(function(err) {
        if (err) {
          return onError(err);
        }
        req.flash('success', __('Password has been reset, you may login now'));
        res.redirect('/login');
      });
    });
  } else {
    onError();
  }
});

module.exports = router;