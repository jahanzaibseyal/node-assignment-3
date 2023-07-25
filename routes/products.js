const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/:productId', async (req, res) => {
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

router.put('/:productId', async (req, res) => {
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

router.delete('/:productId', async (req, res) => {
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

router.get('/search/:keyword', (req, res) => {
  // Search products based on keyword
});
module.exports = router;
