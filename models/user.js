var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

userSchema.methods._instanceMethod = function() {};

userSchema.statics._staticMethod = function() {};

module.exports = mongoose.model('User', userSchema);