
import { NextResponse } from "next/server";
import { products } from "@/lib/db";

export async function GET() {
  try {
    // In a real backend, you would fetch this from a database
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
