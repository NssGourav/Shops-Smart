const express = require('express');
const prisma = require('../utils/prisma');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Place an order
router.post('/', auth, async (req, res) => {
  const { paymentMethod } = req.body;

  try {
    // 1. Get cart items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Calculate total
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // 3. Create order
    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        status: 'PAID', // Simulating successful payment
        items: { create: orderItems },
        payment: {
          create: {
            method: paymentMethod || 'CREDIT_CARD',
            status: 'SUCCESS',
            transactionId: `txn_${Date.now()}`,
          },
        },
      },
      include: { items: true, payment: true },
    });

    // 4. Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

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
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
