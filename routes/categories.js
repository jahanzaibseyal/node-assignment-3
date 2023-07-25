const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.post('/', async (req, res) => {
  try {
    const { name, parent } = req.body;
    const category = await Category.create({
      name,
      parent,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.get('/:categoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.put('/:categoryId', async (req, res) => {
  try {
    const { name, parent } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        name,
        parent,
      },
      { new: true },
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

router.delete('/:categoryId', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.categoryId,
    );
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Inernal Server error' });
  }
});

module.exports = router;
