var express = require('express');
var router = express.Router();

// home page
router.get('/', function(req, res) {
  res.render('index', {});
});

// login page
router.route('/login')
  .get(function(req, res) {
    res.render('login', {});
  })
  .post(function(req, res) {
    res.redirect('/settings');
  });

// logout page
router.post('/logout', function(req, res) {
  res.redirect('/');
});

// register page
router.route('/register')
  .get(function(req, res) {
    res.render('register', {});
  })
  .post(function(req, res) {
    res.redirect('/settings');
  });

// settings page
router.route('/settings')
  .get(function(req, res) {
    res.render('settings', {});
  })
  .post(function(req, res) {
    res.render('settings', {});
  });

module.exports = router;