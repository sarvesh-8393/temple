
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Cart } from "@/lib/mongodb";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: "userId is required" }, { status: 400 });
        }

        await connectToDatabase();

        // Clear the cart for the given user
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return NextResponse.json({ message: "Checkout successful, cart cleared" }, { status: 200 });

    } catch (error) {
        console.error("Failed to process checkout:", error);
        return NextResponse.json({ message: "Failed to process checkout" }, { status: 500 });
    }
}
