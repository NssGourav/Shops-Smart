const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
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
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/products
// @desc    Add a product (Admin only)
router.post(
  '/',
  [auth, admin],
  async (req, res) => {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    try {
      const product = await prisma.product.create({
        data: { name, description, price: parseFloat(price), stock: parseInt(stock), imageUrl, categoryId },
      });
      res.status(201).json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  const { name, description, price, stock, imageUrl, categoryId } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, description, price, stock, imageUrl, categoryId },
    });
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
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
