const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]) ||
      (req.cookies && req.cookies.token);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_login_2k26_change_in_production");

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = { verifyJwt };
