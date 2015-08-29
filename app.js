var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var i18n = require('i18n');
var __ = i18n.__;
var mongodb = require('./lib/mongodb');

var index = require('./routes/index');

// setup
var app = express();
mongodb.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// parsers
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));

// public assets
app.use(favicon(path.join(__dirname, 'public', 'dist', 'img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public', 'dist')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// i18n
var i18nArg = {
  locales: ['en'],
  defaultLocale: 'en',
  cookie: 'lang',
  directory: path.join(__dirname, 'i18n'),
  indent: '  '
};
i18n.configure(i18nArg);
app.use(i18n.init);
app.use(function(req, res, next) { // change locale using 'lang' query string
  var lang = req.query.lang;
  if (lang) {
    if (i18nArg.locales.indexOf(lang) == -1) {
      lang = i18nArg.defaultLocale;
    }
    res.cookie(i18nArg.cookie, lang, {
      maxAge: 900000,
      httpOnly: true
    });
  }
  next();
});

// session
app.use(session({
  name: 'session_id',
  secret: 'secret',
  saveUninitialized: false, // don't create session until something stored
  resave: false, // don't save session if unmodified
  store: new MongoStore({
    mongooseConnection: mongodb.connection,
    touchAfter: 3600 // in seconds
  })
}));

// session user & auth (passport)
app.use(function(req, res, next) {
  res.locals.user = {};
  next();
});

// routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(__('Not Found'));
  err.status = 404;
  next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('_error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('_error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;