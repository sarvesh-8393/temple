import { connectToDatabase, Temple, Product, User, initialTemples, initialProducts, initialUser } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();

        // Clear existing data
        console.log('Clearing existing data...');
        await Temple.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});

        console.log('Seeding temples...');
        await Temple.insertMany(initialTemples);
        
        console.log('Seeding products...');
        await Product.insertMany(initialProducts);

        // Hash password for initial user
        const hashedPassword = await bcrypt.hash('temple123', 10);
        const userWithPassword = {
            ...initialUser,
            password: hashedPassword,
            displayName: initialUser.displayName,
            email: initialUser.email.toLowerCase(),
            plan: initialUser.plan,
            bio: initialUser.bio
        };

        console.log('Seeding user...');
        await User.create(userWithPassword);

        console.log('Database seeded successfully');
        process.exit(0);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();