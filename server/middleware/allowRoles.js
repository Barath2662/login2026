const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const normalizedAllowed = allowedRoles.map((role) => String(role).toLowerCase());
    if (normalizedAllowed.includes("admin")) {
      normalizedAllowed.push("super_admin", "admin_power");
    }
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
