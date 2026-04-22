const express = require('express');
const { auth, admin } = require('../middlewares/auth');
const { categoryService } = require('../services');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await categoryService.listCategories();
    res.json(categories);
  })
);

// @route   POST /api/categories
// @desc    Add a category (Admin only)
router.post(
  '/',
  [auth, admin],
  asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  })
);

module.exports = router;
