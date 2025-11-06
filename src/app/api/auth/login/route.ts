
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase, User } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Make sure to set this in .env

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Don't send password back in response
        const userWithoutPassword = {
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            plan: user.plan,
            bio: user.bio
        };

        return NextResponse.json({
            message: "Login successful",
            user: userWithoutPassword,
            token
        }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
    }
}
