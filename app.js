var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('flash');
var mongodb = require('./lib/mongodb');
var auth = require('./lib/auth');
var i18n = require('./lib/i18n');
var __ = i18n.__;

var index = require('./routes/index');
var admin = require('./routes/admin');

// setup
var app = express();
mongodb.init();
auth.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// parsers
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('secret'));

// public assets
app.use(favicon(path.join(__dirname, 'public', 'dist', 'img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public', 'dist')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// i18n
i18n.init(app);

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
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(function(req, res, next) {
  res.locals.user = req.user || {};
  next();
});

// flash messages
app.use(flash());

// debug toolbar
if (app.get('env') === 'development') {
  var debug = require('express-debug');
  debug(app, {
    depth: 5,
    panels: ['locals', 'request', 'session', 'template']
  });
}

// routes
app.use('/', index);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(__('Not Found'));
  err.status = 404;
  next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('err = ' + err);
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