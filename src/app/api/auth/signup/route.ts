
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase, User } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Make sure to set this in .env

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { firstName, lastName, email, password } = await request.json();

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            displayName: `${firstName} ${lastName}`,
            email: email.toLowerCase(),
            password: hashedPassword,
            plan: 'free',
            bio: ''
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Don't send password back in response
        const userWithoutPassword = {
            _id: newUser._id,
            displayName: newUser.displayName,
            email: newUser.email,
            plan: newUser.plan,
            role: newUser.role,
            bio: newUser.bio
        };

        return NextResponse.json({
            message: "Signup successful",
            user: userWithoutPassword,
            token
        }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
    }
}
