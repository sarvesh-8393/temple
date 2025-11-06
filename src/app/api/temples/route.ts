
import { NextResponse } from "next/server";
import { connectToDatabase, Temple } from '@/lib/mongodb';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export async function GET() {
  try {
    await connectToDatabase();
        const temples = await Temple.find({}).lean();

        // Map _id to id and ensure image URLs are valid (fallback to placeholder)
        const mapped = temples.map((t: any) => {
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
    console.error("Failed to fetch temples:", error);
    return NextResponse.json(
      { message: "Failed to fetch temples" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Comprehensive validation
        if (!body.templeName || !body.description || !body.city || !body.state) {
            return NextResponse.json(
                { message: "Missing required fields: templeName, description, city, and state are required" }, 
                { status: 400 }
            );
        }
        
        await connectToDatabase();

        // Construct the location string
        const location = `${body.address ? body.address + ', ' : ''}${body.city}, ${body.state}${body.zipCode ? ' ' + body.zipCode : ''}`;
        
        // Handle the image URL, if it's a data URL, use a default image
        const imageUrl = body.imageUrl?.startsWith('data:') 
            ? PlaceHolderImages.find(img => img.id === 'temple-north')!.imageUrl 
            : body.imageUrl || PlaceHolderImages.find(img => img.id === 'temple-north')!.imageUrl;

        const newTemple = new Temple({
            name: body.templeName,
            location: location,
            description: body.description,
            image: {
                id: 'new-temple-placeholder',
                imageUrl: imageUrl
            },
            poojas: (body.poojas || []).filter((pooja: any) => pooja.name && pooja.description).map((pooja: any) => ({
                name: pooja.name,
                description: pooja.description,
                price: Number(pooja.price) || 0,
                image: {
                    id: 'pooja-default',
                    imageUrl: PlaceHolderImages.find(img => img.id === 'pooja-havan')!.imageUrl
                },
                tags: [],
                date: 'Upon Request',
                time: 'Flexible'
            }))
        });
        
        await newTemple.save();
        return NextResponse.json(newTemple, { status: 201 });

    } catch (error) {
        console.error("Failed to create temple:", error);
        return NextResponse.json({ message: "Failed to create temple" }, { status: 500 });
    }
}
