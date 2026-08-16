const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ") || !req.cookies.token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = (authHeader && authHeader.split(" ")[1]) || req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = { verifyJwt };
