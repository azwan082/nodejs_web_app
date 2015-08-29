var express = require('express');
var __ = require('i18n').__;
var router = express.Router();

router.get('/', function(req, res) {
  var tab = req.query.tab || 'settings';
  res.render('index-settings', {
    title: __(tab == 'account' ? 'Account' : 'Settings'),
    navbar: {
      selected: 'settings'
    },
    tab: tab
  });
});

router.post('/', function(req, res) {
  res.render('index-settings', {
    title: __('Settings'),
    navbar: {
      selected: 'settings'
    }
  });
});

module.exports = router;