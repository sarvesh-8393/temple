
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { temples, type Pooja } from '@/lib/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OmIcon } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface BookingPooja extends Pooja {
  templeName?: string;
}

export default function TempleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedPooja, setSelectedPooja] = useState<BookingPooja | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const templeId = params.id as string;
  const temple = temples.find((t) => t.id === templeId);

  if (!temple) {
    return (
      <div className="flex-1 p-8 text-center">
        <h1 className="text-2xl font-bold">Temple not found</h1>
        <p className="text-muted-foreground">
          The temple you are looking for does not exist.
        </p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const handleBookNow = (pooja: Pooja, templeName: string) => {
    setSelectedPooja({ ...pooja, templeName });
  };

  const handleConfirmBooking = () => {
    if (!selectedPooja) return;

    setIsBooking(true);
    toast({
      title: 'Processing Booking...',
      description: 'Your pooja booking is being confirmed.',
    });

    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      setSelectedPooja(null);
      toast({
        title: 'Booking Confirmed!',
        description: `Your booking for ${selectedPooja.name} is complete. A confirmation email has been sent.`,
      });
    }, 2000);
  };

  return (
    <main className="flex-1">
      {/* Temple Header */}
      <section className="relative h-80 w-full">
        <Image
          src={temple.image.imageUrl}
          alt={temple.name}
          fill
          className="object-cover"
          data-ai-hint={temple.image.imageHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-4xl font-headline font-bold drop-shadow-lg">
            {temple.name}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-lg text-white/90 drop-shadow-md">
            <MapPin className="h-5 w-5" /> {temple.location}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Temple Description */}
        <section className="mb-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">About the Temple</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{temple.description}</p>
            </CardContent>
          </Card>
        </section>

        {/* Poojas Section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <OmIcon className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-headline font-bold">Poojas Offered</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {temple.poojas.map((pooja) => (
              <Card key={pooja.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {pooja.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={pooja.image.imageUrl}
                      alt={pooja.name}
                      fill
                      className="object-cover"
                      data-ai-hint={pooja.image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{pooja.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {pooja.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{pooja.description}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{pooja.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{pooja.time}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                  <p className="text-lg font-bold text-primary">${pooja.price}</p>
                  <Button onClick={() => handleBookNow(pooja, temple.name)}>Book Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>

       {selectedPooja && (
        <Dialog open={!!selectedPooja} onOpenChange={() => setSelectedPooja(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Confirm Booking</DialogTitle>
              <DialogDescription>
                You are booking the <strong>{selectedPooja.name}</strong> pooja at {selectedPooja.templeName}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pooja</span>
                <span>{selectedPooja.name}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Temple</span>
                <span>{selectedPooja.templeName}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Date</span>
                <span>{selectedPooja.date}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Time</span>
                <span>{selectedPooja.time}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${selectedPooja.price}</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPooja(null)} disabled={isBooking}>
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking} disabled={isBooking}>
                {isBooking ? "Processing..." : "Pay & Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
