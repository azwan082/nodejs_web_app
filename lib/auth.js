var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var __ = require('i18n').__;
var User = require('../models/user');
var Session = require('../models/session');

exports.init = function() {

  // store user info to session data
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // get user info based on session data
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // remember me strategy.
  // given a token stored in cookie, find matching user id, then its info
  passport.use(new RememberMeStrategy({
    key: 'remember'
  }, function(token, done) {
    Session.findOne({
      token: token
    }, function(err, session) {
      if (err) {
        return done(err);
      }
      if (!session) {
        return done(null, false);
      }
      User.findById(session.userId, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }, Session.generateRememberToken));

  // local strategy for login
  passport.use('local', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    var arg = {};
    if (username.indexOf('@') != -1) {
      arg.email = username;
    } else {
      arg.name = username;
    }
    User.findOne(arg, function(err, user) {
      req.session.form = {
        login: username
      };
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash('error', __('User not found')));
      }
      if (!user.isValidPassword(password)) {
        return done(null, false, req.flash('error', __('Wrong password')));
      }
      return done(null, user);
    });
  }));

  // local strategy for register
  passport.use('register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    var email = req.body.email;
    User.findOne({
      $or: [
        { name: username },
        { email: email }
      ]
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        var msg;
        if (user.name == username) {
          msg = __('Username is taken');
        } else {
          msg = __('Email already registered');
        }
        return done(null, false, req.flash('error', msg));
      }
      user = new User({
        name: username,
        email: email,
        password: User.hashPassword(password)
      });
      user.save(function(err) {
        done(err, newUser);
      });
    });
  }));
};