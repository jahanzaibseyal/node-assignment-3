const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Cart = require('../models/cart');
const authJWT = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const sendEmail = require('../emailService');

router.post('/', authJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userCart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'price availableQuantity',
    });
    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let totalPrice = 0;
    for (const item of userCart.items) {
      const product = item.product;
      const quantity = item.quantity;
      totalPrice += product.price * quantity;
      product.availableQuantity -= quantity;
      await product.save();
    }

    // Create a new order from the user's cart
    const newOrder = new Order({
      user: userId,
      products: userCart.items,
      totalPrice: totalPrice,
    });

    await newOrder.save();
    await Cart.deleteOne({ _id: userCart._id });

    const user = req.user.email;
    const subject = 'Order Confirmation';
    const htmlContent = `
      <h1>Thank you for your order!</h1>
      <p>Your order has been placed successfully.</p>
      <p>Order ID: ${newOrder._id}</p>
      <p>Total Price: ${newOrder.totalPrice}</p>
      <p>...</p>
    `;

    await sendEmail(user, subject, htmlContent);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', authJWT, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username')
      .populate('products.product', 'title price')
      .exec();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
