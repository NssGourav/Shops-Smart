const express = require('express');
const Product = require('../models/Product');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/products
// @desc    Add a product (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  const { name, description, price, stock, imageUrl, categoryId } = req.body;

  try {
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imageUrl,
      categoryId,
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  const { name, description, price, stock, imageUrl, categoryId } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, imageUrl, categoryId },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
