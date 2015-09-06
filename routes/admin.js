var express = require('express');
var __ = require('i18n').__;
var users = require('./admin-users');
var middlewares = require('../lib/middlewares');
var router = express.Router();

router.use(middlewares.mustInGroup(['admin']));

router.get('/', function(req, res) {
  res.render('admin', {
    title: __('Admin'),
    navbar: {
      selected: 'admin'
    },
    sidebar: {
      type: 'admin',
      selected: 'overview'
    }
  });
});

router.use('/users', users);

module.exports = router;