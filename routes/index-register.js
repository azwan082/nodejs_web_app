var express = require('express');
var __ = require('i18n').__;
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index-register', {
    title: __('Register'),
    navbar: {
      selected: 'login'
    }
  });
});

router.post('/', function(req, res) {
  req.flash('success', 'Account successfully created');
  req.flash('info', 'You are now logged in');
  res.redirect('/settings');
});

module.exports = router;