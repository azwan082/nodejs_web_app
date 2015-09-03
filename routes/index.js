var express = require('express');
var __ = require('i18n').__;
var login = require('./index-login');
var logout = require('./index-logout');
var register = require('./index-register');
var dashboard = require('./index-dashboard');
var settings = require('./index-settings');
var forgot = require('./index-forgot');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    title: __('Home page'),
    navbar: {}
  });
});

router.use('/login', login);
router.use('/logout', logout);
router.use('/register', register);
router.use('/dashboard', dashboard);
router.use('/settings', settings);
router.use('/forgot', forgot);

module.exports = router;