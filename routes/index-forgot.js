var express = require('express');
var __ = require('i18n').__;
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index-forgot', {
    title: __('Forgot password'),
    navbar: {
      selected: 'login'
    },
    sidebar: {
      type: 'login'
    },
  });
});

router.post('/', function(req, res) {
  res.redirect('/forgot');
});

module.exports = router;