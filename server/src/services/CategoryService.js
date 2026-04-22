const Category = require('../models/Category');
const BaseService = require('./BaseService');

class CategoryService extends BaseService {
  async listCategories() {
    return Category.find().sort({ createdAt: -1 });
  }

  async createCategory(payload) {
    return Category.create({ name: payload.name });
  }
}

module.exports = CategoryService;
