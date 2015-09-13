var express = require('express');
var router = express.Router({
  mergeParams: true
});

router.get('/', function(req, res) {
  var userId = req.params.userId;
  res.render('admin-users-form', {
    title: (userId ? 'Edit' : 'Add') + ' user',
    navbar: {
      selected: 'admin'
    },
    sidebar: {
      type: 'admin',
      selected: 'users'
    },
  });
});

module.exports = router;