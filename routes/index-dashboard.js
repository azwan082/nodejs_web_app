var express = require('express');
var middlewares = require('../lib/middlewares');
var __ = require('i18n').__;
var router = express.Router();

router.get('/', [

  // logged in users only
  middlewares.isLoggedIn('/dashboard'),

  // show page
  function(req, res) {
    res.render('index-dashboard', {
      title: __('Dashboard'),
      navbar: {
        selected: 'settings'
      }
    });
  }

]);

module.exports = router;