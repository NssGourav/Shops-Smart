const express = require('express');
const { auth } = require('../middlewares/auth');
const { orderService } = require('../services');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @route   POST /api/orders
// @desc    Place an order
router.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const order = await orderService.placeOrder(req.user.id, req.body);
    res.status(201).json(order);
  })
);

// @route   GET /api/orders
// @desc    Get current user's orders
router.get(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const orders = await orderService.listOrdersForUser(req.user.id);
    res.json(orders);
  })
);

module.exports = router;
