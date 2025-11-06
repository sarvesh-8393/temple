
import { NextResponse } from "next/server";
import { temples } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const temple = temples.find((t) => t.id === params.id);

    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    return NextResponse.json(temple);
  } catch (error) {
    console.error(`Failed to fetch temple ${params.id}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch temple" },
      { status: 500 }
    );
  }
}
