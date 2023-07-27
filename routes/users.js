const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authJWT = require('../middlewares/authMiddleware');

router.get('/', authJWT, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/:id', authJWT, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User Not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.post('/', authJWT, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const newUser = new User({ name, email, password, isAdmin });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.put('/:id', authJWT, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password,
      isAdmin,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.delete('/:id', authJWT, async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

module.exports = router;
