const Cart = require('../models/Cart');
const Product = require('../models/Product');
const BaseService = require('./BaseService');

class CartService extends BaseService {
  async getCartForUser(userId) {
    let cart = await Cart.findOne({ userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ userId });
      return Cart.findById(cart.id).populate('items.product');
    }

    return cart;
  }

  async addItemToCart(userId, payload) {
    const product = await Product.findById(payload.productId);
    this.ensureFound(product, 'Product not found');

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const nextQuantity = this.parseInteger(payload.quantity, 'quantity', 1);
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === payload.productId
    );

    if (existingItem) {
      existingItem.quantity += nextQuantity;
    } else {
      cart.items.push({
        productId: payload.productId,
        quantity: nextQuantity,
      });
    }

    await cart.save();
    return Cart.findById(cart.id).populate('items.product');
  }

  async removeItemFromCart(userId, itemId) {
    const cart = await Cart.findOne({ userId });
    this.ensureFound(cart, 'Cart not found');

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.id !== itemId);

    if (cart.items.length === initialLength) {
      this.ensureFound(null, 'Cart item not found');
    }

    await cart.save();
    return { message: 'Item removed from cart' };
  }
}

module.exports = CartService;
