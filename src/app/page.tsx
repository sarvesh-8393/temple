
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  HeartHandshake,
  BookOpen,
  Star,
  Search,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Temple } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";


const heroImage = {
    imageUrl: "https://images.unsplash.com/photo-1621787084849-ed98731b3071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxpbmRpYW4lMjB0ZW1wbGV8ZW58MHx8fHwxNzYyMzUyMzMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "indian temple"
};

export default function HomePage() {
  const [allTemples, setAllTemples] = useState<Temple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/temples");
        const data = await res.json();
        setAllTemples(data);
      } catch (error) {
        console.error("Failed to fetch temples:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const featuredTemples = allTemples.filter(
    (temple) =>
      temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white bg-black/50">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Grand temple"
            fill
            className="object-cover -z-10 opacity-50"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="p-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-md">
            A Smarter Way to Connect With Temples
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-sm">
            Book pujas, make donations, browse temple details — all in one
            place.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/poojas">Explore Temples</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link href="/profile">Subscribe Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* 3. Featured Temples Section */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-bold">
              Featured Temples
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover and explore temples from around the world.
            </p>
          </div>
          
          <div className="mb-8 max-w-xl mx-auto">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                      placeholder="Search temples by name or location..."
                      className="pl-10 text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
          </div>

          {isLoading ? (
             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden shadow-lg">
                        <Skeleton className="h-48 w-full" />
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-9 w-full mt-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredTemples.slice(0, 4).map((temple, index) => (
                <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    {temple.image && (
                        <div className="relative h-48 w-full">
                        <Image
                            src={temple.image.imageUrl}
                            alt={temple.name}
                            fill
                            className="object-cover"
                            data-ai-hint={temple.image.imageHint}
                        />
                        </div>
                    )}
                    <CardContent className="p-4">
                    <h3 className="font-bold font-headline">{temple.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {temple.location}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Link href={`/temples/${temple.id}`}>View Details</Link>
                    </Button>
                    </CardContent>
                </Card>
                ))}
            </div>
          )}
        </section>
        
        {/* 5. Subscription Benefits Section */}
        <section className="text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">Unlock Premium Benefits</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our premium plan for an enhanced spiritual experience with exclusive features and discounts.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
                <Badge variant="outline" className="text-base justify-center p-3"><CheckCircle className="text-green-500 mr-2"/> Unlimited puja bookings</Badge>
                <Badge variant="outline" className="text-base justify-center p-3"><CheckCircle className="text-green-500 mr-2"/> Unlimited donations</Badge>
                <Badge variant="outline" className="text-base justify-center p-3"><CheckCircle className="text-green-500 mr-2"/> Zero convenience fees</Badge>
                <Badge variant="outline" className="text-base justify-center p-3"><CheckCircle className="text-green-500 mr-2"/> Full event access</Badge>
            </div>
            <Button asChild size="lg" className="font-bold">
                <Link href="/profile">
                    View Subscription <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TempleConnect. All Rights Reserved.</p>
           <div className="flex justify-center gap-4 mt-4">
             <Link href="#" className="text-sm hover:underline">About</Link>
             <Link href="#" className="text-sm hover:underline">Contact</Link>
             <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
             <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
