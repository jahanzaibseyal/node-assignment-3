const adminMiddleware = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Only admin can do that' });
  }
};

module.exports = adminMiddleware;
