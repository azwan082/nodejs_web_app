var express = require('express');
var __ = require('i18n').__;
var i18n = require('../lib/i18n');
var data = require('moment-timezone/data/meta/latest.json');
var router = express.Router();

router.get('/', function(req, res) {
  var arg = {
    title: __('Settings'),
    navbar: {
      selected: 'settings'
    },
    tab: req.query.tab || 'settings',
    errors: {}
  };
  if (req.session._form) {
    arg.errors = req.session._form.errors || {};
    delete req.session._form;
  }
  if (arg.tab == 'account') {
    arg.title = __('Account');
  }
  else if (arg.tab == 'settings') {
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
  res.render('index-settings', arg);
});

router.post('/', function(req, res) {
  var language = req.body.language || '';
  var country = req.body.country || '';
  var timezone = req.body.timezone || '';
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
  if (Object.keys(errors).length === 0) {
    req.user.language = language;
    req.user.timezone = timezone;
    req.user.country = country;
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
      errors: errors
    };
    res.redirect('/settings');
  }
});

module.exports = router;