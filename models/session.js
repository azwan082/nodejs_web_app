var mongoose = require('mongoose');

var schema = mongoose.Schema({
  token: {
    type: String,
    index: true,
    unique: true
  },
  userId: String
});

schema.statics.generateToken = function() {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

module.exports = mongoose.model('Session', schema);