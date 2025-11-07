"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, ChefHat, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
  image?: {
    imageUrl: string;
    imageHint?: string;
  };
  tags: string[];
  userId: {
    _id: string;
    displayName: string;
  };
  createdAt: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, selectedCategory]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    setFilteredRecipes(filtered);
  };

  const categories = ["all", "Veg", "Non-Veg", "Dessert", "Beverage", "Snack"];

  return (
    <div className="flex-1 bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-headline font-bold mb-4">
            Community Recipes
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share and discover delicious recipes from our temple community.
            Each successful payment unlocks the ability to contribute your favorite recipes.
          </p>
        </div>

        {/* Add Recipe Button */}
        {user && (
          <div className="text-center mb-8">
            <Button asChild size="lg" className="font-bold">
              <Link href="/recipes/create">
                <Plus className="mr-2 h-5 w-5" />
                Share Your Recipe
              </Link>
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="flex-1">
            <Input
              placeholder="Search recipes by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to share a recipe!"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe._id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                {recipe.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.image.imageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      data-ai-hint={recipe.image.imageHint}
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold font-headline text-lg group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {recipe.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.prepTime + recipe.cookTime}min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      by {recipe.userId.displayName}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/recipes/${recipe._id}`}>View Recipe</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
