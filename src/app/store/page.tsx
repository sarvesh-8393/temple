
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
import { ShoppingBag, Star, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Removed import from '@/lib/db' as requested
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";
import { useAuth } from "@/contexts/auth-context";


export default function StorePage() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    imageHint: ''
  });

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
        const carts = await res.json();
        // Assuming we take the first cart for now; in a real app, filter by user
        const userCart = carts.find((cart: any) => cart.userId === user?._id);
        setCart(userCart?.items || []);
    } catch (error) {
        console.error("Failed to fetch cart:", error);
    } finally {
        setIsCartLoading(false);
    }
  }

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
    fetchCart();
    refreshUser(); // Refresh user data to get latest role information
  }, []);
  
  const handleAddToCart = async (product: Product) => {
    if (!user?._id) {
      toast({
        title: "Error",
        description: "You must be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    try {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id, userId: user._id })
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
  
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          image: newProduct.imageUrl ? {
            imageUrl: newProduct.imageUrl,
            imageHint: newProduct.imageHint
          } : undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      const addedProduct = await res.json();
      setAllProducts(prev => [...prev, addedProduct]);
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        imageHint: ''
      });

      toast({
        title: "Product Added",
        description: `${addedProduct.name} has been added to the store.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as Error)?.message || "Could not add product. Please try again.",
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
        <div className="flex gap-2">
          {isClient && user?.role === 'admin' && (
            <Button onClick={() => setShowAddProduct(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
          <Button onClick={handleCheckout}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Cart ({isCartLoading ? '...' : cart.length})
          </Button>
        </div>
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

        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to the temple store.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Product Name *</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description *</label>
                <Input
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price *</label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category (optional)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Enter image URL (optional)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image Hint</label>
                <Input
                  value={newProduct.imageHint}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, imageHint: e.target.value }))}
                  placeholder="Enter image hint (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </main>
  );
}
