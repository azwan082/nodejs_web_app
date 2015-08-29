var mongoose = require('mongoose');
var Meta = require('../models/meta');

var dbName = 'nodejs_web_app';
var dataVersion = 1;
var connectionString = 'mongodb://127.0.0.1:27017/' + dbName;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
  connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + dbName;
}

// for data migration, not schema migration, since mongodb is schema-less
function migrate(version, next) {
  switch (version) {
    case 1:
      next();
      break;
  }
}

var db = mongoose.connection;

db.on('error', function(err) {
  console.log('mongodb connection error: ' + err);
});

db.once('open', function() {
  console.log('mongodb connection successful');
  Meta.findOne({
    key: 'version'
  }, function(err, meta) {
    if (err) {
      console.log('Meta.findById(version): ' + err);
      return;
    }
    var currentVersion = 0;
    if (meta) {
      version = parseInt(meta.value);
    } else {
      meta = new Meta({
        id: 'version'
      });
    }
    if (currentVersion != dataVersion) {
      var i = currentVersion + 1;
      var next = function() {
        i++;
        if (i <= dataVersion) {
          migrate(i, next);
        } else {
          meta.value = dataVersion;
          meta.save(function(err) {
            if (err) {
              console.log('meta.save(): ' + err);
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