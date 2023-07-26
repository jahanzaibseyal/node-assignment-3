const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const authJWT = require('../middlewares/authMiddleware');

router.post('/', authJWT, async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const user = req.user.userId;
    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({
        user,
        items: [{ product, quantity }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product,
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error' });
  }
});

router.get('/', authJWT, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.delete('/:productId', authJWT, async (req, res) => {
  try {
    const userId = req.user?.userId;
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
