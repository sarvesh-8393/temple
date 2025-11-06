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
import { Calendar, Clock } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { OmIcon } from "@/components/icons";

const poojas = [
  {
    id: "p1",
    name: "Ganesh Pooja",
    description: "A special pooja to seek the blessings of Lord Ganesha for success and removal of obstacles.",
    date: "July 28, 2024",
    time: "8:00 AM - 10:00 AM",
    price: 51,
    image: PlaceHolderImages.find((img) => img.id === "pooja-ganesh"),
    tags: ["New Beginnings", "Success"],
  },
  {
    id: "p2",
    name: "Satyanarayan Pooja",
    description: "A ritual to honor Lord Vishnu and seek his blessings for health, wealth, and prosperity.",
    date: "August 5, 2024",
    time: "6:00 PM - 8:00 PM",
    price: 101,
    image: PlaceHolderImages.find((img) => img.id === "pooja-satyanarayan"),
    tags: ["Prosperity", "Family"],
  },
  {
    id: "p3",
    name: "Lakshmi Pooja",
    description: "Invoke the goddess of wealth and fortune for financial well-being and abundance.",
    date: "August 12, 2024",
    time: "7:00 PM - 8:30 PM",
    price: 75,
    image: PlaceHolderImages.find((img) => img.id === "pooja-lakshmi"),
    tags: ["Wealth", "Diwali Special"],
  },
  {
    id: "p4",
    name: "Havan / Yagna",
    description: "A fire ritual to purify the environment and invoke divine energies for spiritual growth.",
    date: "Upon Request",
    time: "Flexible",
    price: 251,
    image: PlaceHolderImages.find((img) => img.id === "pooja-havan"),
    tags: ["Purification", "Spiritual"],
  },
  {
    id: "p5",
    name: "Saraswati Pooja",
    description: "Dedicated to the goddess of knowledge, music, and arts. Ideal for students and artists.",
    date: "August 20, 2024",
    time: "9:00 AM - 11:00 AM",
    price: 61,
    image: PlaceHolderImages.find((img) => img.id === "pooja-saraswati"),
    tags: ["Knowledge", "Education"],
  },
  {
    id: "p6",
    name: "Navagraha Pooja",
    description: "A pooja to appease the nine planets and mitigate their negative effects on one's life.",
    date: "Upon Request",
    time: "Flexible",
    price: 151,
    image: PlaceHolderImages.find((img) => img.id === "pooja-navagraha"),
    tags: ["Astrology", "Well-being"],
  },
];

type Pooja = (typeof poojas)[0];

export default function PoojasPage() {
  const { toast } = useToast();
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookNow = (pooja: Pooja) => {
    setSelectedPooja(pooja);
  };

  const handleConfirmBooking = () => {
    setIsBooking(true);
    toast({
      title: "Processing Booking...",
      description: "Your pooja booking is being confirmed.",
    });

    setTimeout(() => {
      setIsBooking(false);
      setSelectedPooja(null);
      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${selectedPooja?.name} is complete. A confirmation email has been sent.`,
      });
    }, 2000);
  };

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <OmIcon className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Available Poojas</h1>
          <p className="text-muted-foreground">Book a pooja to seek divine blessings.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {poojas.map((pooja) => (
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
              <Button onClick={() => handleBookNow(pooja)}>Book Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPooja && (
        <Dialog open={!!selectedPooja} onOpenChange={() => setSelectedPooja(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Confirm Booking</DialogTitle>
              <DialogDescription>
                You are booking the <strong>{selectedPooja.name}</strong> pooja.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pooja</span>
                <span>{selectedPooja.name}</span>
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
