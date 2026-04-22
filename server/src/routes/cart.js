const express = require('express');
const { auth } = require('../middlewares/auth');
const { cartService } = require('../services');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get current user's cart
router.get(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const cart = await cartService.getCartForUser(req.user.id);
    res.json(cart);
  })
);

// @route   POST /api/cart
// @desc    Add item to cart
router.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const cart = await cartService.addItemToCart(req.user.id, req.body);
    res.status(201).json(cart);
  })
);

// @route   DELETE /api/cart/:id
// @desc    Remove an item from cart
router.delete(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const result = await cartService.removeItemFromCart(
      req.user.id,
      req.params.id
    );
    res.json(result);
  })
);

module.exports = router;
