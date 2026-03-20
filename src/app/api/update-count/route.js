// app/api/update-count/route.js
import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import { Crowd }        from "@/lib/models/Crowd";

export async function POST(request) {
  // --- auth ---
  const key = request.headers.get("x-api-key");
  if (key !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templeId, crowd } = await request.json();

  if (!templeId) {
    return NextResponse.json({ error: "templeId required" }, { status: 400 });
  }

  await connectDB();

  // upsert — creates the crowd doc if it doesn't exist yet, otherwise updates it
  await Crowd.findOneAndUpdate(
    { templeId },
    { crowd },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true });
}