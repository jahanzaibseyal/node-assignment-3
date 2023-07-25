const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

router.post('/', async (req, res) => {
  try {
    const { user, items } = req.body;
    const cart = await Cart.create({
      user,
      items,
    });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = 'user_id'; // Replace 'user_id' with the actual user ID from authentication
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const userId = 'user_id'; // Replace 'user_id' with the actual user ID from authentication
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId,
    );
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

module.exports = router;
