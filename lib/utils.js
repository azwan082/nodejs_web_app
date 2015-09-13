var crypto = require('crypto');
var util = require('util');

exports.generateGUID = function() {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

exports.md5 = function(value) {
  return crypto.createHash('md5').update(value).digest('hex');
};

exports.paginate = function(args) {
  return {
    format: util.format,
    url: args.url,
    totalItem: args.totalItem,
    perPage: args.perPage,
    currentPage: args.currentPage
  };
};