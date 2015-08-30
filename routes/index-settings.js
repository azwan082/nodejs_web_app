var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var i18n = require('../lib/i18n');
var data = require('moment-timezone/data/meta/latest.json');
var User = require('../models/user');
var router = express.Router();

router.get('/', function(req, res) {
  var arg = {
    title: __('Settings'),
    navbar: {
      selected: 'settings'
    },
    tab: req.query.tab || 'settings',
    inputs: {},
    errors: {}
  };
  if (req.session._form) {
    arg.errors = req.session._form.errors || {};
    arg.inputs = req.session._form.inputs || {};
    delete req.session._form;
  }
  if (arg.tab == 'settings') {
    var selectedLanguage = i18n.getSelectedLanguage(req);
    arg.languages = Object.keys(i18n.languages).map(function(id) {
      return {
        id: id,
        name: i18n.languages[id],
        selected: id == selectedLanguage
      };
    });
    arg.timezones = Object.keys(data.zones).map(function(id) {
      return {
        id: id,
        name: data.zones[id].name,
        selected: req.user.timezone == id
      };
    });
    arg.countries = Object.keys(data.countries).map(function(id) {
      return {
        id: id,
        name: data.countries[id].name,
        selected: req.user.country == id
      };
    });
    var sort = function(a, b) {
      return a.name.localeCompare(b.name);
    };
    arg.languages.sort(sort);
    arg.timezones.sort(sort);
    arg.countries.sort(sort);
  }
  else if (arg.tab == 'account') {
    arg.title = __('Account');
    arg.inputs.email = arg.inputs.email || req.user.email;
  }
  res.render('index-settings', arg);
});

router.post('/', function(req, res) {
  var tab = req.query.tab || '';
  if (!tab) {
    return res.redirect('/settings');
  }
  var language = req.body.language || '';
  var country = req.body.country || '';
  var timezone = req.body.timezone || '';
  var email = req.body.email || '';
  var currentPassword = req.body.cpassword || '';
  var newPassword = req.body.npassword || '';
  var errors = {};
  if (tab == 'settings') {
    if (Object.keys(i18n.languages).indexOf(language) == -1) {
      errors.language = 'Invalid language';
    }
    if (Object.keys(data.zones).indexOf(timezone) == -1) {
      errors.timezone = 'Invalid timezone';
    }
    if (Object.keys(data.countries).indexOf(country) == -1) {
      errors.country = 'Invalid country';
    }
  }
  else if (tab == 'account') {
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
  }
  if (Object.keys(errors).length === 0) {
    if (tab == 'settings') {
        req.user.language = language;
        req.user.timezone = timezone;
        req.user.country = country;
      }
      else if (tab == 'account') {
        req.user.email = email;
        if (newPassword) {
          req.user.password = User.hashPassword(password);
        }
      }
      req.user.save(function(err) {
        if (err) {
          req.flash('error', 'Failed to save changes');
        } else {
          req.flash('info', 'Settings saved');
        }
        res.redirect('/settings?tab=' + tab);
      });
  } else {
    req.session._form = {
      errors: errors,
      inputs: {
        email: email
      }
    };
    res.redirect('/settings?tab=' + tab);
  }
});

module.exports = router;