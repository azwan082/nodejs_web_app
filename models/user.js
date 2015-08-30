var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  email: {
    type: String,
    index: true,
    unique: true
  },
  password: String,
  rememberToken: String,
  language: String,
  country: String,
  timezone: String
});

schema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

schema.statics.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model('User', schema);