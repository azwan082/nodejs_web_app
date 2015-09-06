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
  var session = new UserSession({
    token: token,
    userId: user.id
  });
  session.save(function(err) {
    done(err, token);
  });
};

module.exports = UserSession = mongoose.model('UserSession', schema);