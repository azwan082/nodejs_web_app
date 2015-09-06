var express = require('express');
var __ = require('i18n').__;
var auth = require('../lib/auth');
var middlewares = require('../lib/middlewares');
var i18n = require('../lib/i18n');
var UserSession = require('../models/user-session');
var router = express.Router();

router.get('/', [

  middlewares.mustLoggedIn(),

  function(req, res) {
    auth.resetRememberLogin(req, res, function() {
      req.logout();
      req.flash('info', __('You are now logged out'));
      i18n.resetSelectedLanguage(res);
      res.redirect('/');
    });
  }

]);

module.exports = router;