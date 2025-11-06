
import { NextResponse } from "next/server";
import { user } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // This is a mock authentication. In a real app, you would:
        // 1. Validate email and password.
        // 2. Hash the provided password and compare it with the stored hash.
        // 3. Create and return a session token (e.g., JWT).
        
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        // Since we have mock data, we'll just check if the email matches.
        // We are NOT checking the password for this simulation.
        if (email.toLowerCase() === user.email.toLowerCase()) {
            return NextResponse.json({ message: "Login successful", user }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
    }
}
