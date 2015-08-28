var mongoose = require('mongoose');

var dbName = 'nodejs_web_app';
var connectionString = 'mongodb://127.0.0.1:27017/' + dbName;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
  connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + dbName;
}

exports.connection = null;

exports.init = function() {
  mongoose.connect(connectionString);
  var c = mongoose.connection;
  c.on('error', function(err) {
    console.log('mongodb connection error: ' + err);
  });
  c.once('open', function() {
    console.log('mongodb connection successful');
  });
  exports.connection = c;
};