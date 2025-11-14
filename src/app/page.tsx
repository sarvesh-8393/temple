"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  MapPin,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
// Removed import from '@/lib/db' as requested
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { TempleMap } from "@/components/google-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Temple {
  _id: string;
  name: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  image?: {
    imageUrl: string;
    imageHint?: string;
  };
  poojas?: Array<{
    name: string;
    price: number;
  }>;
}

export default function HomePage() {
  const [allTemples, setAllTemples] = useState<Temple[]>([]);
  const [nearbyTemples, setNearbyTemples] = useState<Temple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const isPremium = user?.plan === 'premium';

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Get user's location and fetch nearby temples
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Fetch nearby temples
          try {
            const res = await fetch(`/api/temples/nearby?lat=${latitude}&lng=${longitude}&radius=5000`);
            const data = await res.json();
            setNearbyTemples(data);
          } catch (error) {
            console.error("Failed to fetch nearby temples:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to showing all temples if location fails
          setNearbyTemples(allTemples);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Fallback if geolocation not supported
      setNearbyTemples(allTemples);
    }
  }, [allTemples]);

  // Show subscription popup for all users after login
  useEffect(() => {
    console.log('Popup effect triggered:', { mounted, user: user ? { plan: user.plan, email: user.email } : null });
    if (mounted && user) {
      const hasShownPopup = sessionStorage.getItem('subscriptionPopupShown');
      console.log('Checking popup conditions:', { hasShownPopup, plan: user.plan });
      if (!hasShownPopup) {
        console.log('Showing popup in 1 second');
        // Add a small delay to ensure the page has loaded
        setTimeout(() => {
          console.log('Setting showSubscriptionPopup to true');
          setShowSubscriptionPopup(true);
        }, 1000);
      }
    }
  }, [user, mounted]);

  const handleDismissPopup = () => {
    setShowSubscriptionPopup(false);
    sessionStorage.setItem('subscriptionPopupShown', 'true');
  };

  const handleSubscribe = () => {
    setShowSubscriptionPopup(false);
    sessionStorage.setItem('subscriptionPopupShown', 'true');
    router.push('/profile');
  };

  const featuredTemples = allTemples.filter(
    (temple) =>
      temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background text-foreground">
      {/* Map Section */}
      <div className="w-full h-[70vh] min-h-[500px]">
        <TempleMap temples={allTemples} height="100%" />
      </div>

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
                {featuredTemples.map((temple, index) => (
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
                        <Link href={`/temples/${temple._id}`}>View Details</Link>
                    </Button>
                    </CardContent>
                </Card>
                ))}
            </div>
          )}
        </section>

        {/* 5. Subscription Benefits Section */}
        {mounted && !isPremium && (
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
        )}
      </main>

      {/* Subscription Popup */}
      <Dialog open={showSubscriptionPopup} onOpenChange={setShowSubscriptionPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription>
              Unlock exclusive benefits and enhance your spiritual journey with our premium membership.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm">10% discount on all pooja bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm">5% discount on all store items</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm">Premium member badge on profile</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm">Zero convenience fees</span>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleDismissPopup}>
              Dismiss
            </Button>
            <Button onClick={handleSubscribe} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Star className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
