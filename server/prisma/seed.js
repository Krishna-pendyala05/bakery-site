"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding...');
    // Clean existing data
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cake.deleteMany({});
    await prisma.user.deleteMany({});
    const cakes = [
        {
            name: 'Classic Red Velvet Cake',
            description: 'Velvety cocoa-infused layers frosted with our signature Madagascar vanilla cream cheese icing.',
            price: 34.99,
            imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80',
            category: 'Signature',
            available: true,
        },
        {
            name: 'Decadent Dark Chocolate Fudge',
            description: 'Rich 70% Valrhona dark chocolate cake layered with silky chocolate fudge ganache and topped with dark chocolate curls.',
            price: 38.99,
            imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
            category: 'Chocolate',
            available: true,
        },
        {
            name: 'Zesty Lemon Blueberry Cake',
            description: 'Light lemon sponge layers studded with fresh wild blueberries, filled with house-made tangy lemon curd and swiss meringue buttercream.',
            price: 36.99,
            imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80',
            category: 'Fruity',
            available: true,
        },
        {
            name: 'Premium Salted Caramel Drip',
            description: 'Moist brown sugar cake layered with salted caramel buttercream and finished with a rich caramel drip and sea salt crystals.',
            price: 42.99,
            imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
            category: 'Gourmet',
            available: true,
        },
        {
            name: 'Tropical Mango Coconut Cake',
            description: 'Fluffy coconut sponge layered with fresh mango compote and light whipped coconut cream, coated with toasted coconut flakes.',
            price: 39.99,
            imageUrl: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80',
            category: 'Fruity',
            available: true,
        },
        {
            name: 'Classic Carrot & Walnut Cake',
            description: 'Spiced carrot cake packed with toasted walnuts and raisins, finished with a smooth, tangy cream cheese frosting layer.',
            price: 35.99,
            imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80',
            category: 'Signature',
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
