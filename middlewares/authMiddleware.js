const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = await jwt.verify(
        token,
        process.env.JWT_SECRET || 'tp7k6Umw3ABVELtl3k7jJyaBDK8yNm2a'
      );
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = authenticateJWT;
