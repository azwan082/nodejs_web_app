var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.redirect('/');
});

module.exports = router;