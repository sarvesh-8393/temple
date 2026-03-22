import { NextResponse } from "next/server";
import { connectToDatabase, Temple } from '@/lib/mongodb';
import { Crowd } from '@/lib/models/Crowd';
import jwt from 'jsonwebtoken';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const [temple, crowdDoc] = await Promise.all([
      Temple.findById(id).lean(),
      Crowd.findOne({ templeId: id }).lean(),
    ]);

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
      },
      crowd: {
        current: (crowdDoc as any)?.crowd ?? 0,
        updatedAt: (crowdDoc as any)?.updatedAt ?? null,
      },
    };

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Failed to fetch temple:", error);
    return NextResponse.json({ message: "Failed to fetch temple" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();

    const {
      templeName,
      description,
      address,
      city,
      state,
      zipCode,
      contactEmail,
      imageUrl,
      placeId,
      lat,
      lng,
      poojas,
    } = body;

    // Validate required fields
    if (!templeName || !description || !address) {
      return NextResponse.json(
        { message: "Missing required fields: templeName, description, and address are required" },
        { status: 400 }
      );
    }

    // Find the temple
    const temple = await Temple.findById(id);
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 });
    }

    // Update temple fields
    temple.name = templeName;
    temple.description = description;
    temple.location = address;
    temple.city = city;
    temple.state = state;
    temple.zipCode = zipCode;
    temple.contactEmail = contactEmail;
    temple.placeId = placeId;
    temple.lat = lat;
    temple.lng = lng;

    if (imageUrl) {
      temple.image = {
        imageUrl: imageUrl,
        imageHint: `Image of ${templeName}`,
      };
    }

    if (poojas && Array.isArray(poojas) && poojas.length > 0) {
      temple.poojas = poojas.map((pooja: any) => ({
        name: pooja.name,
        description: pooja.description,
        price: pooja.price,
        time: pooja.times,
        tags: pooja.tags || [],
      }));
    }

    await temple.save();

    return NextResponse.json({
      id: temple._id.toString(),
      message: "Temple updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update temple:", error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to update temple" },
      { status: 500 }
    );
  }
}
