const verifyJWT = (authService) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const userData = authService.verifyToken(token);
      req.user = userData;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { verifyJWT, checkAdmin }; 