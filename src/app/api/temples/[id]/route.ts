
import { NextResponse } from "next/server";
import { connectToDatabase, Temple } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // params may be a promise-like object in Next.js route handlers; await it before use
    const { id } = (await params) as { id: string };

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid temple ID" }, { status: 400 });
    }

    const temple = await Temple.findById(id);

    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    return NextResponse.json(temple);
  } catch (error) {
    console.error(`Failed to fetch temple ${params?.id || 'unknown'}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch temple" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = (await params) as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid temple ID" }, { status: 400 });
    }

    const updates = await request.json();
    const temple = await Temple.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    return NextResponse.json(temple);
  } catch (error) {
    console.error(`Failed to update temple ${params?.id || 'unknown'}:`, error);
    return NextResponse.json(
      { message: "Failed to update temple" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = (await params) as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid temple ID" }, { status: 400 });
    }

    const temple = await Temple.findByIdAndDelete(id);

    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Temple deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete temple ${params?.id || 'unknown'}:`, error);
    return NextResponse.json(
      { message: "Failed to delete temple" },
      { status: 500 }
    );
  }
}
