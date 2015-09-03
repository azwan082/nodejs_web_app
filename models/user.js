var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');

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
  timezone: String,
  avatar: String,
  reset: {
    key: String,
    created: Date
  }
});

schema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

schema.methods.getAvatarUrl = function() {
  if (this.avatar) {
    return '/img/avatar/' + this.avatar;
  }
  return 'http://placehold.it/100x100';
};

schema.methods.getAvatarMetadata = function(ext) {
  var uid = this.id;
  return {
    folder: uid.substr(0, 2) + '/' + uid.substr(2, 2) + '/' + uid.substr(4, 2),
    filename: uid + '_' + Date.now() + '.' + ext
  };
};

schema.statics.avatarPath = path.join(__dirname, '..', 'public', 'dist', 'img', 'avatar');

schema.statics.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model('User', schema);