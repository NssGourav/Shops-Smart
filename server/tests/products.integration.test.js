const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Cart = require('../src/models/Cart');
const Order = require('../src/models/Order');

describe('Products API integration', () => {
  const adminToken = jwt.sign({ id: 'admin-user', role: 'ADMIN' }, process.env.JWT_SECRET);

  beforeEach(async () => {
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
  });

  it('creates and fetches products with their category data', async () => {
    const category = await Category.create({ name: 'Integration Category' });

    const createResponse = await request(global.__TEST_APP__)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: category.id,
        description: 'Created through the API',
        imageUrl: 'https://example.com/product.png',
        name: 'Integration Product',
        price: 1499.99,
        stock: 5,
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body).toMatchObject({
      categoryId: category.id.toString(),
      name: 'Integration Product',
      stock: 5,
    });

    const listResponse = await request(global.__TEST_APP__).get('/api/products');

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0]).toMatchObject({
      category: { name: 'Integration Category' },
      name: 'Integration Product',
    });
  });
});
