var mongoose = require('mongoose');

var dbName = 'nodejs_web_app';
var connectionString = 'mongodb://127.0.0.1:27017/' + dbName;
var db;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + dbName;
}

exports.init = function() {
    mongoose.connect(connectionString);
    db = mongoose.connection;
    db.on('error', function(err) {
        console.log('db connection error: ' + err);
    });
    db.once('open', function() {
        console.log('db connection successful');
    });
};