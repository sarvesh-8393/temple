
import { NextResponse } from "next/server";
import { temples } from "@/lib/db";

export async function GET() {
  try {
    // In a real backend, you would fetch this from a database
    return NextResponse.json(temples);
  } catch (error) {
    console.error("Failed to fetch temples:", error);
    return NextResponse.json(
      { message: "Failed to fetch temples" },
      { status: 500 }
    );
  }
}
