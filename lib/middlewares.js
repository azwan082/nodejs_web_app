var __ = require('i18n').__;
var util = require('util');

exports.mustLoggedIn = function(redirect) {
  return function(req, res, next) {
    if (req.user && req.user.id) {
      next();
    } else {
      req.flash('danger', __('You need to be logged in to view this page'));
      res.redirect('/login' + (redirect ? '?rd=' + encodeURIComponent(redirect) : ''));
    }
  };
};

exports.mustNotLoggedIn = function(req, res, next) {
  if (req.user && req.user.id) {
    var err = new Error(__('You are already logged in'));
    err.content = util.format('<a href="/dashboard">%s</a>', __('Go to dashboard'));
    next(err);
  } else {
    next();
  }
};

exports.mustInGroup = function(groups) {
  return function(req, res, next) {
    if (req.user) {
      if (groups.indexOf(req.user.group) != -1) {
        return next();
      }
    }
    var err = new Error(__('Access denied'));
    err.content = util.format('<a href="/">%s</a>', __('Go home'));
    next(err);
  };
};