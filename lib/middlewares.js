exports.isLoggedIn = function(redirect) {
  return function(req, res, next) {
    if (req.user && req.user.id) {
      next();
    } else {
      req.flash('danger', 'You need to be logged in to view this page');
      res.redirect('/login?rd=' + encodeURIComponent(redirect));
    }
  };
};