import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from 'crypto';
import { User } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      type,
      amount,
      templeName,
      poojaId,
      templeId,
    } = body;

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Add to user's booking history
    await User.findByIdAndUpdate(userId, {
      $push: {
        bookingHistory: {
          type,
          amount,
          templeName,
          poojaId,
          templeId,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          date: new Date(),
          status: 'completed'
        }
      }
    });

    return NextResponse.json({
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to verify payment:", error);
    return NextResponse.json(
      { message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}