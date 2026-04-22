const Cart = require('../models/Cart');
const Order = require('../models/Order');
const HttpError = require('../errors/HttpError');
const BaseService = require('./BaseService');

class OrderService extends BaseService {
  async placeOrder(userId, payload) {
    const cart = await Cart.findOne({ userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new HttpError(400, 'Cart is empty');
    }

    const totalAmount = cart.items.reduce(
      (accumulator, item) => accumulator + item.product.price * item.quantity,
      0
    );

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await Order.create({
      userId,
      totalAmount,
      status: 'PAID',
      items: orderItems,
      payment: {
        method: payload.paymentMethod || 'CREDIT_CARD',
        status: 'SUCCESS',
        transactionId: `txn_${Date.now()}`,
      },
    });

    cart.items = [];
    await cart.save();

    return order;
  }

  async listOrdersForUser(userId) {
    return Order.find({ userId }).populate('items.product').sort({
      createdAt: -1,
    });
  }
}

module.exports = OrderService;
