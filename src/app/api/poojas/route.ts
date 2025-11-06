
import { NextResponse } from "next/server";
import { connectToDatabase, Temple } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch temples from the database and return them; frontend will map poojas
    const temples = await Temple.find({}).lean();
    return NextResponse.json(temples);
  } catch (error) {
    console.error("Failed to fetch poojas:", error);
    return NextResponse.json({ message: "Failed to fetch poojas" }, { status: 500 });
  }
}
