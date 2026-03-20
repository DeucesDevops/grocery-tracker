import { PrismaClient, ShoppingListStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create User
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: 'hashed_password_here', // In a real app, this would be bcrypt hashed
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
  });

  console.log(`User created: ${user.email}`);

  // 2. Create Categories
  const categoriesData = [
    { name: 'Produce', icon: 'Apple', color: '#22c55e' },
    { name: 'Dairy & Eggs', icon: 'Egg', color: '#f59e0b' },
    { name: 'Meat & Seafood', icon: 'Beef', color: '#ef4444' },
    { name: 'Bakery', icon: 'Croissant', color: '#84cc16' },
    { name: 'Frozen Foods', icon: 'IceCream', color: '#06b6d4' },
    { name: 'Pantry', icon: 'Cookie', color: '#f97316' },
    { name: 'Beverages', icon: 'Coffee', color: '#3b82f6' },
    { name: 'Household', icon: 'Home', color: '#6366f1' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categories.push(createdCat);
  }

  console.log(`Created ${categories.length} categories`);

  // 3. Create Items
  const itemsData = [
    { name: 'Apples', unit: 'kg', category: 'Produce' },
    { name: 'Bananas', unit: 'kg', category: 'Produce' },
    { name: 'Milk 2L', unit: 'each', category: 'Dairy & Eggs' },
    { name: 'Eggs 12pk', unit: 'each', category: 'Dairy & Eggs' },
    { name: 'Chicken Breast', unit: 'kg', category: 'Meat & Seafood' },
    { name: 'Sourdough Bread', unit: 'each', category: 'Bakery' },
    { name: 'Frozen Pizza', unit: 'each', category: 'Frozen Foods' },
    { name: 'Pasta 500g', unit: 'each', category: 'Pantry' },
    { name: 'Coffee Beans 250g', unit: 'each', category: 'Beverages' },
    { name: 'Paper Towels', unit: 'each', category: 'Household' },
  ];

  const items = [];
  for (const itemData of itemsData) {
    const category = categories.find(c => c.name === itemData.category);
    const item = await prisma.item.create({
      data: {
        name: itemData.name,
        unit: itemData.unit,
        userId: user.id,
        categoryId: category?.id,
      },
    });
    items.push(item);
  }

  console.log(`Created ${items.length} items`);

  // 4. Create Shops
  const shopsData = [
    { name: 'Aldi Supermarket', address: '123 Budget St', category: 'supermarket' },
    { name: 'Trader Joe\'s', address: '456 Gourmet Ave', category: 'supermarket' },
    { name: 'Whole Foods Market', address: '789 Organic Rd', category: 'supermarket' },
    { name: 'Local Farmers Market', address: 'Town Square', category: 'market' },
  ];

  const shops = [];
  for (const shopData of shopsData) {
    const shop = await prisma.shop.create({
      data: {
        ...shopData,
        userId: user.id,
      },
    });
    shops.push(shop);
  }

  console.log(`Created ${shops.length} shops`);

  // 5. Create Item Prices (sample data)
  for (const item of items) {
    for (const shop of shops) {
      // Random price between 1.00 and 15.00
      const price = (Math.random() * 14 + 1).toFixed(2);
      await prisma.itemPrice.create({
        data: {
          itemId: item.id,
          shopId: shop.id,
          price: parseFloat(price),
        },
      });
    }
  }

  console.log('Created item price records');

  // 6. Create Shopping Lists
  const list1 = await prisma.shoppingList.create({
    data: {
      userId: user.id,
      shopId: shops[0].id, // Aldi
      name: 'Weekend Groceries',
      budget: 80.00,
      status: ShoppingListStatus.ACTIVE,
      date: new Date(),
      items: {
        create: [
          { itemId: items[0].id, qty: 1.5, estPrice: 3.50, checked: true },
          { itemId: items[1].id, qty: 1, estPrice: 2.20, checked: true },
          { itemId: items[2].id, qty: 1, estPrice: 4.50, checked: false },
          { itemId: items[3].id, qty: 1, estPrice: 5.80, checked: true },
        ]
      }
    }
  });

  const list2 = await prisma.shoppingList.create({
    data: {
      userId: user.id,
      name: 'Party Supplies',
      budget: 120.00,
      status: ShoppingListStatus.DRAFT,
      date: new Date(Date.now() + 86400000 * 2), // 2 days later
      items: {
        create: [
          { itemId: items[6].id, qty: 3, estPrice: 15.00, checked: false },
          { itemId: items[8].id, qty: 2, estPrice: 20.00, checked: false },
        ]
      }
    }
  });

  console.log(`Created shopping lists: ${list1.name}, ${list2.name}`);

  // 7. Create Expenses (Recent History)
  const pastLists = [
    { name: 'Weekly Essentials', shop: shops[2], total: 86.40, date: new Date(Date.now() - 86400000) },
    { name: 'Mid-week Topup', shop: shops[1], total: 45.10, date: new Date(Date.now() - 86400000 * 7) },
    { name: 'Veggie Run', shop: shops[3], total: 32.00, date: new Date(Date.now() - 86400000 * 10) },
    { name: 'Big Monthly Shop', shop: shops[0], total: 112.90, date: new Date(Date.now() - 86400000 * 14) },
  ];

  for (const past of pastLists) {
    const list = await prisma.shoppingList.create({
      data: {
        userId: user.id,
        shopId: past.shop.id,
        name: past.name,
        status: ShoppingListStatus.COMPLETED,
        date: past.date,
      }
    });

    await prisma.expense.create({
      data: {
        userId: user.id,
        listId: list.id,
        totalSpent: past.total,
        createdAt: past.date,
      }
    });
  }

  console.log('Created expense history');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
