
import { NextResponse } from "next/server";
import { cart, products, type Product } from "@/lib/db";

export async function GET() {
  try {
    // In a real app, you'd fetch the cart for the logged-in user
    return NextResponse.json(cart);
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
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const productToAdd = products.find(p => p.id === productId);

        if (!productToAdd) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // In a real DB, you would add this to the user's cart collection/table
        cart.push(productToAdd);
        
        return NextResponse.json(cart, { status: 200 });

    } catch (error) {
        console.error("Failed to add to cart:", error);
        return NextResponse.json({ message: "Failed to add to cart" }, { status: 500 });
    }
}
