import { NextResponse } from "next/server";
import { connectToDatabase, Recipe, User } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (userId) {
      query.userId = userId;
    }

    const recipes = await Recipe.find(query)
      .populate('userId', 'displayName')
      .sort({ createdAt: -1 });

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
      image,
      tags
    } = body;

    // Check if user has permission to create recipes
    const user = await User.findById(session.user.id);
    if (!user || !user.canCreateRecipes) {
      return NextResponse.json({ message: "Recipe creation not unlocked. Please make a payment first." }, { status: 403 });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
      image,
      tags,
      userId: session.user.id
    });

    await recipe.save();

    return NextResponse.json(
      { message: "Recipe created successfully", recipe },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return NextResponse.json(
      { message: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
