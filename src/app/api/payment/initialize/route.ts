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
    const { amount, currency, receipt } = body;

    if (!amount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure minimum amount of ₹10 (1000 paise)
    if (amount < 1000) {
      return NextResponse.json(
        { message: "Minimum payment amount is ₹10" },
        { status: 400 }
      );
    }

    // Create order
    const order = await razorpay.orders.create({
      amount: amount, // amount already in paise from frontend
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to initialize payment:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
