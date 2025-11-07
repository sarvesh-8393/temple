import { NextResponse } from "next/server";
import { connectToDatabase, Temple } from '@/lib/mongodb';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '5000'); // Default 5km radius

    if (!lat || !lng) {
      return NextResponse.json(
        { message: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get all temples with lat/lng
    const temples = await Temple.find({
      lat: { $exists: true, $ne: null },
      lng: { $exists: true, $ne: null }
    }).lean();

    // Filter temples within radius
    const nearbyTemples = temples.filter((temple: any) => {
      if (!temple.lat || !temple.lng) return false;
      const distance = calculateDistance(lat, lng, temple.lat, temple.lng);
      return distance <= radius / 1000; // Convert radius to km
    });

    // Map _id to id and ensure image URLs are valid
    const mapped = nearbyTemples.map((t: any) => {
      const id = t._id?.toString() || t.id;
      const imageUrl = t.image?.imageUrl;
      const validImage = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
        ? imageUrl
        : PlaceHolderImages.find(img => img.id === 'temple-north')!.imageUrl;
      return {
        ...t,
        id,
        image: {
          ...(t.image || {}),
          imageUrl: validImage,
        }
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Failed to fetch nearby temples:", error);
    return NextResponse.json(
      { message: "Failed to fetch nearby temples" },
      { status: 500 }
    );
  }
}
