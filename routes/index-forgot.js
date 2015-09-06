var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var jade = require('jade');
var path = require('path');
var User = require('../models/user');
var mailer = require('../lib/mailer');
var middlewares = require('../lib/middlewares');
var utils = require('../lib/utils');
var router = express.Router();

router.use(middlewares.mustNotLoggedIn);

router.get('/', function(req, res) {
  var inputs = {};
  var errors = {};
  if (req.session._form) {
    inputs = req.session._form.inputs || {};
    errors = req.session._form.errors || {};
    delete req.session._form;
  }
  res.render('index-forgot', {
    title: __('Forgot password'),
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
  var email = req.body.email || '';
  var errors = {};
  if (email.length === 0) {
    errors.email = __('Email is required');
  }
  else if (!iz.email(email)) {
    errors.email = __('Invalid email');
  }
  if (req.xhr) {
    return res.json({
      status: 'ok',
      errors: errors
    });
  }
  
  var onError = function(err) {
    if (err) {
      req.flash('danger', err.message || err);
    }
    req.session._form = {
      errors: errors
    };
    res.redirect('/forgot');
  };
  
  if (Object.keys(errors).length === 0) {
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        return onError(err);
      }
      if (!user)  {
        return onError(__('User not found'));
      }
      var resetKey = utils.md5(utils.generateGUID() + user.id);
      user.reset = {
        key: resetKey,
        created: new Date()
      };
      user.save(function(err) {
        if (err) {
          return onError(err);
        }
        var template = path.join(__dirname, '..', 'views', 'index-forgot-template.jade');
        var fn = jade.compileFile(template);
        var html = fn({
          __: __,
          url: 'http://localhost:8080/reset/?key=' + resetKey
        });
        mailer.sendMail({
          from: 'noreply@localhost',
          to: email,
          subject: __('Reset password'),
          html: html
        }, function(err, info) {
          if (err) {
            return onError(err);
          }
          req.session._form = {
            inputs: {
              sent: true
            }
          };
          req.flash('success', __('Email sent'));
          res.redirect('/forgot');
        });
      });
    });
  } else {
    onError();
  }
});

module.exports = router;