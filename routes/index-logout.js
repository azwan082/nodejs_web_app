var express = require('express');
var auth = require('../lib/auth');
var middlewares = require('../lib/middlewares');
var router = express.Router();

router.get('/', [

  middlewares.mustLoggedIn(),

  function(req, res) {
    req.logout();
    req.flash('info', 'You are now logged out');
    res.clearCookie(auth.REMEMBER_ME_COOKIE);
    res.redirect('/');
  }

]);

module.exports = router;