
"use client";

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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const heroImage = PlaceHolderImages.find((img) => img.id === "temple-south");
const templeNorth = PlaceHolderImages.find(
  (img) => img.id === "temple-north"
);
const poojaGanesh = PlaceHolderImages.find(
  (img) => img.id === "pooja-ganesh"
);
const poojaLakshmi = PlaceHolderImages.find(
  (img) => img.id === "pooja-lakshmi"
);

const featuredTemples = [
  {
    name: "Sri Venkateswara Temple",
    location: "Tirupati, Andhra Pradesh",
    image: heroImage,
  },
  {
    name: "Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    image: templeNorth,
  },
  {
    name: "Ganesh Temple",
    location: "Mumbai, Maharashtra",
    image: poojaGanesh,
  },
  {
    name: "Lakshmi Temple",
    location: "Jaipur, Rajasthan",
    image: poojaLakshmi,
  },
];

export default function HomePage() {
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
        {/* 2. Value Props Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl font-headline font-bold text-center mb-2">
            Why Use Our Platform?
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            We provide a seamless and secure bridge between you and your spiritual journey.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-md">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <HeartHandshake className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="pt-2">Easy Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Fast & secure online donations through trusted payment gateways.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="pt-2">Puja Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Book your pujas anytime, anywhere, with instant confirmations.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Star className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="pt-2">Unlimited Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  No fees, no limits, and premium features with our subscription plan.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. Featured Temples Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl font-headline font-bold text-center mb-8">
            Featured Temples
          </h2>
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
                  <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* 4. How It Works Section */}
        <section className="mb-16 md:mb-24 bg-muted/50 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-headline font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center bg-primary/10 rounded-full h-16 w-16 mb-4">
                        <Search className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">1. Browse Temples</h3>
                    <p className="text-muted-foreground">Find temples and explore services like pujas and events.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center bg-primary/10 rounded-full h-16 w-16 mb-4">
                        <HeartHandshake className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">2. Make Donations / Book Pujas</h3>
                    <p className="text-muted-foreground">Securely complete your transaction in just a few clicks.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center bg-primary/10 rounded-full h-16 w-16 mb-4">
                        <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">3. Get Instant Confirmation</h3>
                    <p className="text-muted-foreground">Receive immediate confirmation for your booking or donation.</p>
                </div>
            </div>
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
