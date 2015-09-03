var express = require('express');
var __ = require('i18n').__;
var iz = require('iz');
var multer = require('multer');
var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var fs = require('fs-extra');
var data = require('moment-timezone/data/meta/latest.json');
var i18n = require('../lib/i18n');
var User = require('../models/user');
var middlewares = require('../lib/middlewares');
var router = express.Router();

// logged in users only
router.use(middlewares.mustLoggedIn('/settings'));

router.get('/', function(req, res) {
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
    sidebar: {
      type: 'settings',
      selected: 'settings'
    },
    errors: errors,
    inputs: inputs,
    languages: languages,
    timezones: timezones,
    countries: countries
  });
});

router.post('/', [

  // handling file uploads
  multer({
    dest: path.join(__dirname, '..', 'uploads'),
    limits: {
      fileSize: 1048576 // max file size = 1MB
    }
  }).single('avatar'),

  // multer error handling
  function(err, req, res, next) {
    if (err) {
      req.session._form = {
        errors: {
          avatar: err.message
        }
      };
      res.redirect('/settings');
    } else {
      next();
    }
  },

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
    validateAvatar(req, function(err, avatar) {
      if (err) {
        errors.avatar = err;
      }
      if (Object.keys(errors).length === 0) {
        req.user.language = language;
        req.user.timezone = timezone;
        req.user.country = country;
        req.user.email = email;
        if (newPassword) {
          req.user.password = User.hashPassword(password);
        }
        if (avatar) {
          req.user.avatar = avatar;
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
    });
  }

]);

function validateAvatar(req, done) {
  var avatar = req.file || {};
  if (avatar.fieldname == 'avatar') {
    if (avatar.mimetype.indexOf('image/') !== 0) {
      return done('Accept image file only');
    }
    var ext;
    switch (avatar.mimetype) {
      case 'image/jpg':
      case 'image/jpeg':
        ext = 'jpg';
        break;
      case 'image/png':
        ext = 'png';
        break;
    }
    if (!ext) {
      return done('Unsupported image type');
    }
    gm(avatar.path).size(function(err, value) {
      if (err) {
        return done('Cannot get image dimension');
      }
      var w = value.width;
      var h = value.height;
      if (w > 1000 || h > 1000) {
        return done('Image too large');
      }
      
      var meta = req.user.getAvatarMetadata(ext);
      fs.mkdirs(path.join(User.avatarPath, meta.folder), function(err) {
        if (err) {
          return done(err);
        }
        
        var saved = function(err) {
          if (err) {
            return done(err.message);
          }
          var newAvatar = path.join(meta.folder, meta.filename);
          var currentAvatar = req.user.avatar;
          if (currentAvatar) {
            return fs.remove(path.join(User.avatarPath, currentAvatar), function(err) {
              if (err) {
                return done(err.message);
              }
              done(null, newAvatar);
            });
          }
          done(null, newAvatar);
        };
        
        // resize avatar image to 100 x 100, 
        // if not square, crop at center
        var dest = path.join(User.avatarPath, meta.folder, meta.filename);
        if (w == h) {
          return gm(avatar.path).resize(100, 100).write(dest, saved);
        }
        var nh = null, nw = null, x = 0, y = 0;
        if (w > h) {
          nh = 100;
          x = Math.round((((w / h) * nh) - 100) / 2);
        } else {
          nw = 100;
          y = Math.round((((h / w) * nw) - 100) / 2);
        }
        gm(avatar.path).resize(nw, nh).crop(100, 100, x, y).write(dest, saved);
      });
    });
  }
  done();
}

module.exports = router;