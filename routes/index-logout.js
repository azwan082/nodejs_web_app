var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.user.id) {
    req.logout();
    req.flash('info', 'You are now logged out');
  }
  res.redirect('/');
});

module.exports = router;