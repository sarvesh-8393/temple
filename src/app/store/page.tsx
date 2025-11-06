
"use client";

import React, { useState, useEffect } from "react";
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
import { ShoppingBag, Star, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Product } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";


export default function StorePage() {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      setIsProductsLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
        setIsCartLoading(true);
        const res = await fetch('/api/cart');
        const data = await res.json();
        setCart(data);
    } catch (error) {
        console.error("Failed to fetch cart:", error);
    } finally {
        setIsCartLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);
  
  const handleAddToCart = async (product: Product) => {
    try {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id })
        });
        if (!res.ok) throw new Error("Failed to add item to cart");
        
        const updatedCart = await res.json();
        setCart(updatedCart);

        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`,
        });
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Could not add item to cart. Please try again.",
            variant: "destructive"
        })
    }
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
  
  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    toast({
      title: "Processing Order...",
      description: "Finalizing your purchase, please wait.",
    });

    try {
        const res = await fetch('/api/cart/checkout', { method: 'POST' });
        if (!res.ok) throw new Error("Checkout failed");

        setTimeout(() => {
          setIsProcessing(false);
          setShowCheckout(false);
          setCart([]);
          toast({
            title: "Purchase Complete!",
            description: `Your order has been placed. A confirmation email is on its way.`,
          });
        }, 2000); // Simulate processing time

    } catch (error) {
        console.error(error);
        setIsProcessing(false);
        toast({
            title: "Error",
            description: "There was a problem with your purchase. Please try again.",
            variant: "destructive"
        });
    }
  };
  
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Cart ({isCartLoading ? '...' : cart.length})
        </Button>
      </div>

       <div className="mb-8 max-w-xl">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                  placeholder="Search for products..."
                  className="pl-10 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isProductsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="flex flex-col overflow-hidden">
                    <Skeleton className="h-56 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Skeleton className="h-8 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
            <div className="col-span-full text-center py-10">
                <p className="text-lg text-muted-foreground">No products found for your search.</p>
            </div>
        )}
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
              {isCartLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : cart.length > 0 ? (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
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
              <Button onClick={handleConfirmPurchase} disabled={isProcessing || cart.length === 0}>
                {isProcessing ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </main>
  );
}
