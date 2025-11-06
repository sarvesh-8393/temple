
import { NextResponse } from "next/server";
import { connectToDatabase, Cart } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    // Note: In a real app, you'd get the userId from the session
    // For now, we'll fetch all carts
    const carts = await Cart.find({}).populate('items');
    return NextResponse.json(carts);
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, userId } = body;

        if (!productId || !userId) {
            return NextResponse.json({ message: "Product ID and User ID are required" }, { status: 400 });
        }

        await connectToDatabase();
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        
        cart.items.push(productId);
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items');
        return NextResponse.json(populatedCart, { status: 200 });

    } catch (error) {
        console.error("Failed to add to cart:", error);
        return NextResponse.json({ message: "Failed to add to cart" }, { status: 500 });
    }
}
