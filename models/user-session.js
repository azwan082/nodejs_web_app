var mongoose = require('mongoose');
var utils = require('../lib/utils');

var schema = mongoose.Schema({
  token: {
    type: String,
    index: true,
    unique: true
  },
  userId: String
});

schema.statics.generateRememberToken = function(user, done) {
  var token = utils.generateGUID();
  user.rememberToken = token;
  user.save(function(err) {
    done(err, token);
  });
};

module.exports = mongoose.model('UserSession', schema);