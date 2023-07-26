const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const authJWT = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', authJWT, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      availableQuantity,
      category,
      otherProperties,
    } = req.body;
    const product = await Product.create({
      title,
      description,
      price,
      availableQuantity,
      category,
      otherProperties,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/', authJWT, adminMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/:productId', authJWT, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.put('/:productId', authJWT, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      availableQuantity,
      category,
      otherProperties,
    } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        title,
        description,
        price,
        availableQuantity,
        category,
        otherProperties,
      },
      { new: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.delete('/:productId', authJWT, adminMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId,
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/search/:keyword', authJWT, async (req, res) => {
  try {
    const searchTerm = req.params.keyword;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({ title: { $regex: regex } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;
