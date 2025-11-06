
import { NextResponse } from "next/server";
import { temples, allPoojas } from "@/lib/db";
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Basic validation
        if (!body.templeName || !body.description || !body.location) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
        
        const newTempleId = `t${temples.length + 1}`;
        
        const newTemple = {
            id: newTempleId,
            name: body.templeName,
            location: `${body.city}, ${body.state}`,
            description: body.description,
            image: {
                id: 'new-temple-placeholder',
                imageUrl: body.imageUrl || PlaceHolderImages.find(img => img.id === 'temple-north')!.imageUrl,
                imageHint: 'temple',
            },
            poojas: (body.poojas || []).map((pooja: any, index: number) => ({
                ...pooja,
                id: `p${allPoojas.length + index + 1}`,
                // In a real app you might want to find a better placeholder
                image: PlaceHolderImages.find(img => img.id === 'pooja-havan')!,
                tags: pooja.tags || [],
                date: 'Upon Request',
                time: 'Flexible'
            })),
        };
        
        // In a real DB, you'd insert this record
        temples.push(newTemple);
        
        return NextResponse.json(newTemple, { status: 201 });

    } catch (error) {
        console.error("Failed to create temple:", error);
        return NextResponse.json({ message: "Failed to create temple" }, { status: 500 });
    }
}
