var express = require('express');
var __ = require('i18n').__;
var usersForm = require('./admin-users-form');
var utils = require('../lib/utils');
var middlewares = require('../lib/middlewares');
var User = require('../models/user');
var router = express.Router();
var perPage = 5;

router.use(middlewares.mustInGroup(['admin']));

router.use('/create', usersForm);
router.use('/:userId', usersForm);

router.get('/', function(req, res) {
  var pageNum = parseInt(req.query.pg) || 1;
  var keyword = req.query.q || '';
  var findArg;
  if (keyword) {
    if (keyword.length >= 2 && keyword.length < 32) {
      findArg = {
        name: new RegExp(keyword, 'g')
      };
    } else {
      keyword = null;
      req.flash('warning', 'Search keyword too short');
    }
  }
  User.count(findArg, function(err, totalItem) {
    User.find(findArg)
    .select('name email group avatar')
    .limit(perPage)
    .skip(perPage * (pageNum - 1))
    .sort({
      name: 1
    })
    .exec(function(err, users) {
      if (req.xhr) {
        res.json({
          status: 'ok',
          users: users,
          paginate: {
            totalItem: totalItem,
            perPage: perPage,
            currentPage: pageNum
          }
        });
      } else {
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
            url: '/admin/users?pg=%d' + (keyword ? '&q=' + encodeURIComponent(keyword) : ''),
            totalItem: totalItem,
            perPage: perPage,
            currentPage: pageNum
          }),
          keyword: keyword,
          users: users || []
        });
      }
    });
  });
});

module.exports = router;