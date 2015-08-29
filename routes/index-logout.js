var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.user.id) {
    req.logout();
    req.flash('info', 'You are now logged out');
    res.clearCookie(auth.REMEMBER_ME_COOKIE);
  }
  res.redirect('/');
});

module.exports = router;