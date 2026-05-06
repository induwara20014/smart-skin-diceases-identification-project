function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return function roleMiddleware(req, res, next) {
    if (!req.user || !req.user.role) return res.status(401).json({ message: "Unauthenticated" });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    return next();
  };
}

module.exports = { requireRole };

