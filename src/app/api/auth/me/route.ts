import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from 'jsonwebtoken';
import { User } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        plan: user.plan,
        role: user.role,
        bio: user.bio,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to get user:", error);
    return NextResponse.json(
      { message: "Failed to get user" },
      { status: 500 }
    );
  }
}
