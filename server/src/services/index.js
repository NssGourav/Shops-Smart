const CartService = require('./CartService');
const CategoryService = require('./CategoryService');
const OrderService = require('./OrderService');
const ProductService = require('./ProductService');

module.exports = {
  cartService: new CartService(),
  categoryService: new CategoryService(),
  orderService: new OrderService(),
  productService: new ProductService(),
};
