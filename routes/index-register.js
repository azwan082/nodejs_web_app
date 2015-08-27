var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index-register', {});
});

router.post('/', function(req, res) {
  res.redirect('/settings');
});

module.exports = router;