var mongoose = require('mongoose');

var schema = mongoose.Schema({
  key: {
    type: String,
    index: true
  },
  value: String
});
// schema.set('autoIndex', false); // TODO uncomment in live server

module.exports = mongoose.model('Meta', schema);