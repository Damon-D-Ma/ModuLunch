
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You must be logged in to access this' });
  }
  next();
}


module.exports = requireLogin;
