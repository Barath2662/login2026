const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const normalizedAllowed = allowedRoles.map((role) => String(role).toLowerCase());

    // 'admin' alias → also includes super_admin, admin_power
    if (normalizedAllowed.includes('admin')) {
      normalizedAllowed.push('super_admin', 'admin_power');
    }
    // 'coordinator' alias → event_coordinator, special_user, junior_attendance
    if (normalizedAllowed.includes('coordinator')) {
      normalizedAllowed.push('event_coordinator', 'special_user', 'junior_attendance');
    }

    const userRole = req.user && req.user.role ? String(req.user.role).toLowerCase() : null;

    if (!req.user || !userRole || !normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user.role = userRole;
    next();
  };
};

module.exports = allowRoles;

