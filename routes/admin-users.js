var express = require('express');
var __ = require('i18n').__;
var middlewares = require('../lib/middlewares');
var router = express.Router();

router.use(middlewares.mustInGroup(['admin']));

router.get('/', function(req, res) {
	res.render('admin-users', {
    title: __('Users'),
    navbar: {
      selected: 'admin'
    },
    sidebar: {
      type: 'admin',
      selected: 'users'
    }
  });
});

module.exports = router;