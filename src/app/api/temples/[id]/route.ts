import { NextResponse } from "next/server";
import { connectToDatabase, Temple } from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const temple = await Temple.findById(id).lean();
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    // Map _id to id and ensure image URLs are valid (fallback to placeholder)
    const { PlaceHolderImages } = await import('@/lib/placeholder-images');
    const templeId = (temple as any)._id?.toString() || (temple as any).id;
    const imageUrl = (temple as any).image?.imageUrl;
    const validImage = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
      ? imageUrl
      : PlaceHolderImages.find(img => img.id === 'temple-north')!.imageUrl;

    const mapped = {
      ...temple,
      id: templeId,
      image: {
        ...((temple as any).image || {}),
        imageUrl: validImage,
      }
    };

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Failed to fetch temple:", error);
    return NextResponse.json({ message: "Failed to fetch temple" }, { status: 500 });
  }
}
