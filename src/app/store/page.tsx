"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

const products = [
  {
    id: "s1",
    name: "Tirupati Laddu Prasad",
    description: "Authentic, sacred laddu from the famous Tirupati temple, made with pure ghee and nuts.",
    price: 15,
    image: PlaceHolderImages.find((img) => img.id === "product-prasad"),
    rating: 4.9,
    reviews: 1200,
  },
  {
    id: "s2",
    name: "Panchamrita",
    description: "A holy mixture of five nectars: milk, yogurt, honey, ghee, and sugar.",
    price: 25,
    image: PlaceHolderImages.find((img) => img.id === "product-incense"),
    rating: 4.8,
    reviews: 450,
  },
  {
    id: "s3",
    name: "Brass Diya Set",
    description: "A set of two beautifully handcrafted brass oil lamps for your home altar.",
    price: 45,
    image: PlaceHolderImages.find((img) => img.id === "product-diya"),
    rating: 4.7,
    reviews: 310,
  },
  {
    id: "s4",
    name: "Marble Krishna Statue",
    description: "A 6-inch exquisite marble murti of Lord Krishna, perfect for worship and decor.",
    price: 120,
    image: PlaceHolderImages.find((img) => img.id === "product-murti"),
    rating: 4.9,
    reviews: 150,
  },
];

type Product = (typeof products)[0];

export default function StorePage() {
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAddToCart = (product: Product) => {
    setCart(prevCart => [...prevCart, product]);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    setShowCheckout(true);
  };
  
  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    toast({
      title: "Processing Order...",
      description: "Finalizing your purchase, please wait.",
    });

    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckout(false);
      setCart([]);
      toast({
        title: "Purchase Complete!",
        description: `Your order has been placed. A confirmation email is on its way.`,
      });
    }, 2000);
  };
  
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <ShoppingBag className="w-10 h-10 text-primary" />
            <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Temple Store</h1>
            <p className="text-muted-foreground">Purchase prasad and religious items to support our temples.</p>
            </div>
        </div>
        <Button onClick={handleCheckout}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Cart ({cart.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {product.image && (
              <div className="relative h-56 w-full bg-muted">
                <Image
                  src={product.image.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.image.imageHint}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">{product.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
              <p className="text-lg font-bold text-primary">${product.price}</p>
              <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Checkout</DialogTitle>
              <DialogDescription>
                Review your items before purchasing.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-64 overflow-y-auto pr-4 space-y-4 my-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
             <hr className="my-4" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCheckout(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPurchase} disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </main>
  );
}
