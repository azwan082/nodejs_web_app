var mongoose = require('mongoose');

var schema = mongoose.Schema({
  key: {
    type: String,
    index: true
  },
  value: String
});

module.exports = mongoose.model('Meta', schema);