
import { NextResponse } from "next/server";
import { connectToDatabase, Product } from '@/lib/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check for JWT token in Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    await connectToDatabase();
    const User = require('@/lib/mongodb').User;
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 403 });
    }

    const body = await request.json();

    // Comprehensive validation
    if (!body.name || !body.description || !body.price) {
      return NextResponse.json(
        { message: "Missing required fields: name, description, and price are required" },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      image: body.image || {},
      category: body.category || '',
      inStock: body.inStock !== undefined ? body.inStock : true
    });

    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
