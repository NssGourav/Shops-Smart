const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding ---');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopsmart.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@shopsmart.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // 2. Create Categories
  const categoryNames = ['Electronics', 'Home & Living', 'Fashion', 'Beauty'];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  console.log('Categories created');

  // 3. Create Products
  const products = [
    {
      name: 'Premium Wireless Headphones',
      description: 'Noise cancelling overhead headphones with 40h battery life.',
      price: 299.99,
      stock: 50,
      categoryId: categories[0].id,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
      name: 'Smart Watch Series X',
      description: 'Track your health and stay connected all day.',
      price: 349.0,
      stock: 30,
      categoryId: categories[0].id,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
    {
      name: 'Minimalist Coffee Table',
      description: 'Solid wood coffee table for your modern living room.',
      price: 189.5,
      stock: 15,
      categoryId: categories[1].id,
      imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500',
    },
    {
      name: 'Classic White T-Shirt',
      description: 'Organic cotton, comfortable fit, goes with everything.',
      price: 25.0,
      stock: 100,
      categoryId: categories[2].id,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Products created');
  console.log('--- Seeding Finished ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
