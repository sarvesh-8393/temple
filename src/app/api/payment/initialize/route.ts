import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from 'crypto';

// Initialize Razorpay instance
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { amount, userId, type } = body;

    if (!amount || !userId || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("Failed to initialize payment:", error);
    return NextResponse.json(
      { message: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}