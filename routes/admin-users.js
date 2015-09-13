var express = require('express');
var __ = require('i18n').__;
var utils = require('../lib/utils');
var middlewares = require('../lib/middlewares');
var User = require('../models/user');
var router = express.Router();
var perPage = 5;

router.use(middlewares.mustInGroup(['admin']));

// TODO
// router.use('/create', userAdd);
// router.use('/:userId', userEdit);

router.get('/', function(req, res) {
  var pageNum = parseInt(req.query.pg) || 1;
  User.count(function(err, totalItem) {
    User.find()
    .select('name email group avatar')
    .limit(perPage)
    .skip(perPage * (pageNum - 1))
    .sort({
      name: 1
    })
    .exec(function(err, users) {
      res.render('admin-users', {
        title: __('Users'),
        navbar: {
          selected: 'admin'
        },
        sidebar: {
          type: 'admin',
          selected: 'users'
        },
        paginate: utils.paginate({
          url: '/admin/users?pg=%d',
          totalItem: totalItem,
          perPage: perPage,
          currentPage: pageNum
        }),
        users: users || []
      });
    });
  });
});

module.exports = router;