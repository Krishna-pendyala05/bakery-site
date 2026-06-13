import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cake.deleteMany({});
  await prisma.user.deleteMany({});

  const cakes = [
    {
      name: 'Pineapple Fresh Cream Cake',
      description: 'Ultra-moist vanilla sponge layers filled with juicy pineapple chunks, layered with fresh whipped cream and topped with glazed pineapple slices.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      category: 'Fruity',
      available: true,
    },
    {
      name: 'Classic Red Velvet Cake',
      description: 'Velvety cocoa-infused red sponge layers frosted with our signature Madagascar vanilla cream cheese icing and decorated with red velvet crumbs.',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80',
      category: 'Signature',
      available: true,
    },
    {
      name: 'Wild Blue Berry Custard Cake',
      description: 'Fresh vanilla sponge layers layered with premium blueberry compote and creamy custard, topped with a cascade of fresh wild blueberries.',
      price: 32.99,
      imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80',
      category: 'Fruity',
      available: true,
    },
    {
      name: 'Black Forest Gateau',
      description: 'Traditional German sponge cake layered with rich chocolate cream, dark sweet cherries, and kirsch, covered in dark chocolate flakes.',
      price: 31.99,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
      category: 'Chocolate',
      available: true,
    },
    {
      name: 'Classic Chocolate Fudge Cake',
      description: 'Rich and moist double chocolate sponge layered with a decadent Belgian chocolate fudge frosting and topped with chocolate curls.',
      price: 35.99,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      category: 'Chocolate',
      available: true,
    },
    {
      name: 'Lavender Blue Berry Cake',
      description: 'Delicate lavender-infused cake layers filled with sweet blueberry coulis and coated in a smooth white chocolate frosting.',
      price: 36.99,
      imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80',
      category: 'Fruity',
      available: true,
    },
    {
      name: 'Double Choco Chip Cake',
      description: 'Moist chocolate cake loaded with premium dark chocolate chips inside and out, layered with fluffy vanilla buttercream.',
      price: 33.99,
      imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      category: 'Chocolate',
      available: true,
    },
    {
      name: 'Kaju Katli Celebration Cake',
      description: 'A luxurious fusion cake flavored with cardamom, topped with premium crushed cashew nuts, and finished with elegant edible silver leaf.',
      price: 45.99,
      imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
      category: 'Fusion',
      available: true,
    },
    {
      name: 'Rasmalai Cardamom Cake',
      description: 'Soft saffron-infused sponge soaked in cardamom milk, layered with fresh pistachio crumbs and real Rasmalai sweet pieces.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80',
      category: 'Fusion',
      available: true,
    }
  ];

  for (const cake of cakes) {
    const createdCake = await prisma.cake.create({
      data: cake,
    });
    console.log(`Created cake: ${createdCake.name} (ID: ${createdCake.id})`);
  }

  // Create a default test user
  const testUser = await prisma.user.create({
    data: {
      mobile: '+919999999999',
      name: 'John Doe',
      verified: true
    }
  });
  console.log(`Created test user: ${testUser.name} (Mobile: ${testUser.mobile})`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
