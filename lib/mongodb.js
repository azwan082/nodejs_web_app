var mongoose = require('mongoose');
var Meta = require('../models/meta');
var User = require('../models/user');

var DB_NAME = 'nodejs_web_app';
var DB_VERSION = 1;
var connectionString = 'mongodb://127.0.0.1:27017/' + DB_NAME;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
  connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + DB_NAME;
}

// for data migration, not schema migration, since mongodb is schema-less
function migrate(version, next) {
  console.log('migrate(), version: ' + version);
  switch (version) {
    case 1:
      var user = new User({
        name: 'admin',
        email: 'admin@localhost',
        password: User.hashPassword('password'),
        group: 'admin'
      });
      user.save(function(err) {
        if (err) {
          console.error('user.save(): ' + err);
        }
        next();
      });
      break;
  }
}

var db = mongoose.connection;

db.on('error', function(err) {
  console.error('mongodb connection error: ' + err);
});

db.once('open', function() {
  console.log('mongodb connection successful');
  Meta.findOne({
    key: 'version'
  }, function(err, meta) {
    if (err) {
      console.error('Meta.findById(version): ' + err);
      return;
    }
    var currentVersion = 0;
    if (meta) {
      currentVersion = parseInt(meta.value);
    } else {
      meta = new Meta({
        key: 'version'
      });
    }
    if (currentVersion != DB_VERSION) {
      var i = currentVersion + 1;
      var next = function() {
        i++;
        if (i <= DB_VERSION) {
          migrate(i, next);
        } else {
          meta.value = DB_VERSION;
          meta.save(function(err) {
            if (err) {
              console.error('meta.save(): ' + err);
            }
          });
        }
      };
      migrate(i, next);
    }
  });
});
exports.connection = db;

exports.init = function() {
  mongoose.connect(connectionString);
};