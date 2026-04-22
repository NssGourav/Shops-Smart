const express = require('express');
const { auth, admin } = require('../middlewares/auth');
const { productService } = require('../services');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await productService.listProducts();
    res.json(products);
  })
);

// @route   GET /api/products/:id
// @desc    Get product by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  })
);

// @route   POST /api/products
// @desc    Add a product (Admin only)
router.post(
  '/',
  [auth, admin],
  asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  })
);

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
router.put(
  '/:id',
  [auth, admin],
  asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  })
);

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
router.delete(
  '/:id',
  [auth, admin],
  asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  })
);

module.exports = router;
