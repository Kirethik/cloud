import { connectCosmosDB, getCosmosContainer } from './database/cosmos';
import prisma, { connectSqlDB } from './database/sql';
import { env } from './config/env';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log("🌱 Starting Database Seeding...");

    // Connect to Databases
    await connectCosmosDB();
    await connectSqlDB();

    console.log("\n--- Seeding Azure SQL Database (Users) ---");
    const testEmail = "testuser@ecommerce.com";

    let user = await prisma.user.findUnique({ where: { email: testEmail } });
    if (!user) {
        const hashedPassword = await bcrypt.hash("password123", 10);
        user = await prisma.user.create({
            data: {
                email: testEmail,
                password_hash: hashedPassword
            }
        });
        console.log(`✅ Created test user: ${testEmail} (password: password123)`);
    } else {
        console.log(`ℹ️ Test user already exists: ${testEmail}`);
    }

    console.log("\n--- Seeding Azure Cosmos DB (Products) ---");
    const container = getCosmosContainer();

    // Check if we already have products
    const { resources: existingProducts } = await container.items.query('SELECT * FROM c').fetchAll();

    if (existingProducts.length === 0) {
        const dummyProducts = [
            {
                id: "1",
                name: "Wireless Noise-Cancelling Headphones",
                description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
                price: 299.99,
                category: "Electronics",
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                stock: 50,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "2",
                name: "Minimalist Smartwatch",
                description: "Sleek fitness tracker and smartwatch with heart rate monitoring and water resistance.",
                price: 149.50,
                category: "Wearables",
                imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                stock: 120,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "3",
                name: "Ergonomic Office Chair",
                description: "Adjustable lumbar support and breathable mesh design for long working sessions.",
                price: 199.00,
                category: "Furniture",
                imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
                stock: 15,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: "4",
                name: "Stainless Steel Water Bottle",
                description: "Double-walled vacuum insulated bottle keeps drinks cold for 24 hours.",
                price: 35.00,
                category: "Accessories",
                imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
                stock: 200,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        for (const product of dummyProducts) {
            await container.items.create(product);
            console.log(`✅ Inserted product: ${product.name}`);
        }
    } else {
        console.log(`ℹ️ Products already exist in Cosmos DB. Skipping product seeding.`);
    }

    console.log("\n🎉 Seeding Complete!\n");
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
