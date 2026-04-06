const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Place an order
router.post('/', auth, async (req, res) => {
  const { paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Calculate total
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      status: 'PAID',
      items: orderItems,
      payment: {
        method: paymentMethod || 'CREDIT_CARD',
        status: 'SUCCESS',
        transactionId: `txn_${Date.now()}`,
      },
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/orders
// @desc    Get current user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
