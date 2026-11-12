const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Get Token From Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first.",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach User ID
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;
