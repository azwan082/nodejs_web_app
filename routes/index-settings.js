var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var i18n = require('../lib/i18n');
var data = require('moment-timezone/data/meta/latest.json');
var User = require('../models/user');
var middlewares = require('../lib/middlewares');
var router = express.Router();

router.get('/', [

  // logged in users only
  middlewares.isLoggedIn('/settings'),

  // settings form
  function(req, res) {
    var errors = {};
    var inputs = {};
    if (req.session._form) {
      errors = req.session._form.errors || {};
      inputs = req.session._form.inputs || {};
      delete req.session._form;
    }
    inputs.email = inputs.email || req.user.email;
    inputs.language = inputs.language || i18n.getSelectedLanguage(req);
    inputs.timezone = inputs.timezone || req.user.timezone;
    inputs.country = inputs.country || req.user.country;
    var languages = Object.keys(i18n.languages).map(function(id) {
      return {
        id: id,
        name: i18n.languages[id],
        selected: id == inputs.language
      };
    });
    var timezones = Object.keys(data.zones).map(function(id) {
      return {
        id: id,
        name: data.zones[id].name,
        selected: id == inputs.timezone
      };
    });
    var countries = Object.keys(data.countries).map(function(id) {
      return {
        id: id,
        name: data.countries[id].name,
        selected: id == inputs.country
      };
    });
    var sort = function(a, b) {
      return a.name.localeCompare(b.name);
    };
    languages.sort(sort);
    timezones.sort(sort);
    countries.sort(sort);
    res.render('index-settings', {
      title: __('Settings'),
      navbar: {
        selected: 'settings'
      },
      errors: errors,
      inputs: inputs,
      languages: languages,
      timezones: timezones,
      countries: countries
    });
  }

]);

router.post('/', [

  // logged in users only
  middlewares.isLoggedIn('/settings'),

  // save form
  function(req, res) {
    var language = req.body.language || '';
    var country = req.body.country || '';
    var timezone = req.body.timezone || '';
    var email = req.body.email || '';
    var currentPassword = req.body.cpassword || '';
    var newPassword = req.body.npassword || '';
    var errors = {};
    if (Object.keys(i18n.languages).indexOf(language) == -1) {
      errors.language = 'Invalid language';
    }
    if (Object.keys(data.zones).indexOf(timezone) == -1) {
      errors.timezone = 'Invalid timezone';
    }
    if (Object.keys(data.countries).indexOf(country) == -1) {
      errors.country = 'Invalid country';
    }
    if (email.length === 0) {
      errors.email = 'Email is required';
    }
    else if (!iz.email(email)) {
      errors.email = 'Invalid email';
    }
    if (newPassword.length) {
      if (req.user.isValidPassword(currentPassword)) {
        errors.currentPassword = 'Wrong password';
      } else {
        if (newPassword.length < 5) {
          errors.newPassword = 'New password too short';
        }
        else if (newPassword.length > 32) {
          errors.newPassword = 'New password too long';
        }
      }
    }
    if (Object.keys(errors).length === 0) {
      req.user.language = language;
      req.user.timezone = timezone;
      req.user.country = country;
      req.user.email = email;
      if (newPassword) {
        req.user.password = User.hashPassword(password);
      }
      req.user.save(function(err) {
        if (err) {
          req.flash('error', 'Failed to save changes');
        } else {
          req.flash('info', 'Settings saved');
        }
        res.redirect('/settings');
      });
    } else {
      req.session._form = {
        errors: errors,
        inputs: {
          language: language,
          timezone: timezone,
          country: country,
          email: email
        }
      };
      res.redirect('/settings');
    }
  }

]);

module.exports = router;