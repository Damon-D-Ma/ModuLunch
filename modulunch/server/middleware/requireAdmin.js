function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You must be logged in to access this' });
  } else if (!req.session.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}
module.exports = requireAdmin;
