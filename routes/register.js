const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authJWT = require('../middlewares/authMiddleware');

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isAdmin = false;
    const newUser = new User({ name, email, password, isAdmin });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});
module.exports = router;
