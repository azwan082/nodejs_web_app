var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index-settings', {});
});

router.post('/', function(req, res) {
  res.render('index-settings', {});
});

module.exports = router;