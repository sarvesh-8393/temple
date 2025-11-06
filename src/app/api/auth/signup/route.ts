
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, password } = await request.json();

        // This is a mock signup. In a real app, you would:
        // 1. Validate the input data.
        // 2. Check if the user already exists in your database.
        // 3. Hash the password.
        // 4. Create a new user record in the database.
        
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }
        
        // Simulate a successful user creation.
        // In a real DB, you'd be inserting a new record.
        console.log(`Simulating signup for: ${email}`);

        const newUser = {
            displayName: `${firstName} ${lastName}`,
            email: email,
        }

        return NextResponse.json({ message: "Signup successful", user: newUser }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
    }
}
