const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const normalizedAllowed = allowedRoles.map((role) => String(role).toLowerCase());
    const userRole = req.user && req.user.role ? String(req.user.role).toLowerCase() : null;

    if (!req.user || !userRole || !normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    req.user.role = userRole;
    next();
  };
};

module.exports = allowRoles;
