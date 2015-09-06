var i18n = require('i18n');
var path = require('path');

var LANGUAGE_COOKIE = 'lang';
var LANGUAGE_GET_QUERY = 'lang';

exports.__ = i18n.__;
exports.languages = {
  en: 'English',
  ms: 'Malay'
};

var initArg = {
  locales: Object.keys(exports.languages),
  defaultLocale: Object.keys(exports.languages).shift(),
  cookie: LANGUAGE_COOKIE,
  directory: path.join(__dirname, '..', 'i18n'),
  indent: '  ',
  // updateFiles: false
};

exports.init = function(app) {
  i18n.configure(initArg);
  app.use(i18n.init);
  app.use(function(req, res, next) {
    exports.setSelectedLanguage(res, req.query[LANGUAGE_GET_QUERY]);
    next();
  });
};

exports.setSelectedLanguage = function(res, lang) {
  if (lang) {
    if (initArg.locales.indexOf(lang) == -1) {
      lang = initArg.defaultLocale;
    }
    res.cookie(initArg.cookie, lang, {
      maxAge: 31536000000 // 1 yr
    });
  }
};

exports.getSelectedLanguage = function(req) {
  return req.cookies[initArg.cookie] || initArg.defaultLocale;
};

exports.resetSelectedLanguage = function(res) {
  res.clearCookie(initArg.cookie);
};