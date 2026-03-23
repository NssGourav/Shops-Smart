const express = require('express');
const prisma = require('../utils/prisma');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: true } } },
      });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // 1. Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id } });

    // 2. Check if item exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
      res.json(updatedItem);
    } else {
      const newItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: quantity || 1 },
      });
      res.status(201).json(newItem);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/cart/:id
// @desc    Remove an item from cart
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cartItem.delete({
      where: { id },
    });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
