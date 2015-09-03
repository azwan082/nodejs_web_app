exports.mustLoggedIn = function(redirect) {
  return function(req, res, next) {
    if (req.user && req.user.id) {
      next();
    } else {
      req.flash('danger', 'You need to be logged in to view this page');
      res.redirect('/login' + (redirect ? '?rd=' + encodeURIComponent(redirect) : ''));
    }
  };
};

exports.mustNotLoggedIn = function(req, res, next) {
  if (req.user && req.user.id) {
    req.flash('warning', 'You are already logged in');
    res.redirect('/dashboard');
  } else {
    next();
  }
};