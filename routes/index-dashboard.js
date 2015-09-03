var express = require('express');
var middlewares = require('../lib/middlewares');
var __ = require('i18n').__;
var router = express.Router();

// logged in users only
router.use(middlewares.mustLoggedIn('/dashboard'));

router.get('/', function(req, res) {
  res.render('index-dashboard', {
    title: __('Dashboard'),
    navbar: {
      selected: 'settings'
    },
    sidebar: {
      type: 'settings',
      selected: 'dashboard'
    }
  });
});

module.exports = router;