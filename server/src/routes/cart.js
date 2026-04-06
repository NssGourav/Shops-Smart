const express = require('express');
const Cart = require('../models/Cart');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      'items.product'
    );
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart = await Cart.findById(cart.id).populate('items.product');
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
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    const nextQuantity = quantity || 1;

    if (existingItem) {
      existingItem.quantity += nextQuantity;
    } else {
      cart.items.push({
        productId,
        quantity: nextQuantity,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(existingItem ? 200 : 201).json(cart);
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
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.id !== id);
    await cart.save();

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
