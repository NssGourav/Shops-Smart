const Category = require('../models/Category');
const Product = require('../models/Product');
const BaseService = require('./BaseService');

class ProductService extends BaseService {
  async listProducts() {
    return Product.find().populate('category').sort({ createdAt: -1 });
  }

  async getProductById(productId) {
    const product = await Product.findById(productId).populate('category');
    return this.ensureFound(product, 'Product not found');
  }

  async createProduct(payload) {
    await this.ensureCategoryExists(payload.categoryId);

    const product = await Product.create(this.buildPayload(payload));
    return this.getProductById(product.id);
  }

  async updateProduct(productId, payload) {
    await this.ensureCategoryExists(payload.categoryId);

    const product = await Product.findByIdAndUpdate(
      productId,
      this.buildPayload(payload),
      { new: true, runValidators: true }
    ).populate('category');

    return this.ensureFound(product, 'Product not found');
  }

  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    this.ensureFound(product, 'Product not found');

    return { message: 'Product removed' };
  }

  async ensureCategoryExists(categoryId) {
    const category = await Category.findById(categoryId);
    this.ensureFound(category, 'Category not found');
  }

  buildPayload({ name, description, price, stock, imageUrl, categoryId }) {
    return {
      name,
      description,
      price: this.parseNumber(price, 'price'),
      stock: this.parseInteger(stock, 'stock'),
      imageUrl,
      categoryId,
    };
  }
}

module.exports = ProductService;
