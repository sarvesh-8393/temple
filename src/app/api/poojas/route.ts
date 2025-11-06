
import { NextResponse } from "next/server";
import { temples } from "@/lib/db";

export async function GET() {
  try {
    // In a real backend, you would fetch and structure this from a database
    return NextResponse.json(temples); // Returning all temples which contain poojas
  } catch (error) {
    console.error("Failed to fetch poojas:", error);
    return NextResponse.json(
      { message: "Failed to fetch poojas" },
      { status: 500 }
    );
  }
}
