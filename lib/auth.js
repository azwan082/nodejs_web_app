var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var __ = require('i18n').__;
var User = require('../models/user');
var UserSession = require('../models/user-session');

var REMEMBER_ME_COOKIE = 'remember';

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
    key: REMEMBER_ME_COOKIE
  }, function(token, done) {
    console.log('RememberMeStrategy, token: ', token);
    UserSession.findOne({
      token: token
    }, function(err, session) {
      console.log('UserSession.findOne, err: ', err, ', session: ', session);
      if (err) {
        return done(err);
      }
      if (!session) {
        return done(null, false);
      }
      User.findById(session.userId, function(err, user) {
        console.log('User.findById, err: ', err, ', user: ', user);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      });
    });
  }, UserSession.generateRememberToken));

  // local strategy for login
  passport.use('local', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, login, password, done) {
    var arg = {};
    if (login.indexOf('@') != -1) {
      arg.email = login;
    } else {
      arg.name = login;
    }
    User.findOne(arg, function(err, user) {
      req.session._form = req.session._form || {};
      req.session._form.inputs = {
        login: login
      };
      req.session._form.errors = {};
      if (err) {
        return done(err);
      }
      if (!user) {
        req.session._form.errors.login = __('User not found');
        return done(null, false);
      }
      if (!user.isValidPassword(password)) {
        req.session._form.errors.password = __('Wrong password');
        return done(null, false);
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
        req.session._form = {
          inputs: {
            username: username,
            email: email
          },
          errors: {}
        };
        if (user.name == username) {
          req.session._form.errors.username = __('Username is taken');
        } else {
          req.session._form.errors.email = __('Email already registered');
        }
        return done(null, false);
      }
      user = new User({
        name: username,
        email: email,
        password: User.hashPassword(password),
        group: 'member'
      });
      user.save(function(err) {
        if (!err) {
          req.session._form = { success: true };
        }
        done(err, user);
      });
    });
  }));

};

exports.rememberLogin = function(res, user, remember, done) {
  if (remember) {
    UserSession.generateRememberToken(user, function(err, token) {
      if (!err) {
        res.cookie(REMEMBER_ME_COOKIE, token, {
          httpOnly: true,
          maxAge: 31536000000
        });
      }
      done();
    });
  } else {
    done();
  }
};

exports.resetRememberLogin = function(req, res, done) {
  var token = req.cookies[REMEMBER_ME_COOKIE];
  if (token) {
    res.clearCookie(REMEMBER_ME_COOKIE);
    UserSession.findOneAndRemove({
      token: token
    }, function(err) {
      done();
    });
  } else {
    done();
  }
};