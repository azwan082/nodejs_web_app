var express = require('express');
var login = require('./index-login');
var logout = require('./index-logout');
var register = require('./index-register');
var settings = require('./index-settings');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {});
});

router.use('/login', login);
router.use('/logout', logout);
router.use('/register', register);
router.use('/settings', settings);

module.exports = router;