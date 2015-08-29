var express = require('express');
var __ = require('i18n').__;
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index-settings', {
    title: __('Settings')
  });
});

router.post('/', function(req, res) {
  res.render('index-settings', {
    title: __('Settings')
  });
});

module.exports = router;