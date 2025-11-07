"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChefHat } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function CreateRecipePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    prepTime: "",
    cookTime: "",
    servings: "",
    category: "",
    tags: [] as string[],
    tagInput: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Veg", "Non-Veg", "Dessert", "Beverage", "Snack"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, formData.tagInput.trim()],
        tagInput: ""
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a recipe.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category ||
        !formData.prepTime || !formData.cookTime || !formData.servings) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty ingredients and instructions
    const filteredIngredients = formData.ingredients.filter(ing => ing.trim());
    const filteredInstructions = formData.instructions.filter(inst => inst.trim());

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      toast({
        title: "Incomplete recipe",
        description: "Please add at least one ingredient and instruction.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          ingredients: filteredIngredients,
          instructions: filteredInstructions,
          prepTime: parseInt(formData.prepTime),
          cookTime: parseInt(formData.cookTime),
          servings: parseInt(formData.servings)
        })
      });

      if (response.ok) {
        toast({
          title: "Recipe created!",
          description: "Your recipe has been shared with the community."
        });
        router.push("/recipes");
      } else {
        const error = await response.json();
        toast({
          title: "Failed to create recipe",
          description: error.message || "Something went wrong.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 bg-background text-foreground">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-8">
              Please log in to share your recipes with the community.
            </p>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            Share Your Recipe
          </h1>
          <p className="text-muted-foreground">
            Contribute to our community by sharing your favorite recipes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recipe Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Masala Dosa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of your recipe..."
                  rows={3}
                  required
                />
              </div>

              {/* Time and Servings */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) => handleInputChange("prepTime", e.target.value)}
                    placeholder="15"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cookTime">Cook Time (minutes) *</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    value={formData.cookTime}
                    onChange={(e) => handleInputChange("cookTime", e.target.value)}
                    placeholder="20"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Servings *</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={formData.servings}
                    onChange={(e) => handleInputChange("servings", e.target.value)}
                    placeholder="4"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <Label>Ingredients *</Label>
                <div className="space-y-2 mt-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleArrayChange("ingredients", index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("ingredients", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("ingredients")}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ingredient
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <Label>Instructions *</Label>
                <div className="space-y-2 mt-2">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={instruction}
                        onChange={(e) => handleArrayChange("instructions", index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        className="flex-1"
                        rows={2}
                      />
                      {formData.instructions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("instructions", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("instructions")}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="tags"
                    value={formData.tagInput}
                    onChange={(e) => handleInputChange("tagInput", e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
