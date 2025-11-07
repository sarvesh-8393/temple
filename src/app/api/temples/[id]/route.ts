import { NextResponse } from "next/server";
import { connectToDatabase, Temple } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    // Find the temple and check if the user is the creator
    const temple = await Temple.findById(params.id);
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    if (temple.creator.toString() !== session.user.id) {
      return NextResponse.json({ message: "Only the creator can edit this temple" }, { status: 403 });
    }

    // Update the temple
    const updatedTemple = await Temple.findByIdAndUpdate(
      params.id,
      {
        name: body.templeName,
        location: body.location,
        description: body.description,
        image: body.image,
        poojas: body.poojas,
        contact: body.contact
      },
      { new: true }
    );

    return NextResponse.json(updatedTemple);
  } catch (error) {
    console.error("Failed to update temple:", error);
    return NextResponse.json({ message: "Failed to update temple" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Find the temple and check if the user is the creator
    const temple = await Temple.findById(params.id);
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    if (temple.creator.toString() !== session.user.id) {
      return NextResponse.json({ message: "Only the creator can delete this temple" }, { status: 403 });
    }

    // Delete the temple
    await Temple.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Temple deleted successfully" });
  } catch (error) {
    console.error("Failed to delete temple:", error);
    return NextResponse.json({ message: "Failed to delete temple" }, { status: 500 });
  }
}
