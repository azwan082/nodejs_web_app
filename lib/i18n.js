var i18n = require('i18n');
var path = require('path');

exports.__ = i18n.__;
exports.languages = {
  en: 'English',
  ms: 'Malay'
};

var arg = {
  locales: Object.keys(exports.languages),
  defaultLocale: Object.keys(exports.languages).shift(),
  cookie: 'lang',
  directory: path.join(__dirname, '..', 'i18n'),
  indent: '  ',
  // updateFiles: false
};

exports.init = function(app) {
  i18n.configure(arg);
  app.use(i18n.init);
  app.use(function(req, res, next) { // change locale using 'lang' query string
    var lang = req.query.lang;
    if (lang) {
      if (arg.locales.indexOf(lang) == -1) {
        lang = arg.defaultLocale;
      }
      res.cookie(arg.cookie, lang, {
        maxAge: 31536000000
      });
    }
    next();
  });
};

exports.getSelectedLanguage = function(req) {
  return req.cookies[arg.cookie] || arg.defaultLocale;
};