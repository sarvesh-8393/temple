"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { OmIcon } from "@/components/icons";
// Removed import from '@/lib/db' as requested
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Image {
  imageUrl: string;
  imageHint?: string;
}

interface Pooja {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: Image;
  date?: string;
  time?: string;
  tags: string[];
}

interface Temple {
  id: string;
  name: string;
  location: string;
  image: Image;
  poojas: Pooja[];
}

export default function PoojasPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [error, setError] = useState<string | null>(null);
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null);
  const [selectedTempleName, setSelectedTempleName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPoojas = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/poojas');
            if (!res.ok) {
                throw new Error('Failed to fetch poojas');
            }
            const data = await res.json();
            setTemples(data);
        } catch (error) {
            console.error("Failed to fetch poojas:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchPoojas();
  }, []);

  const getAvailableTimes = (pooja: Pooja) => {
    if (pooja.time && pooja.time !== 'Flexible') {
      return pooja.time.split(',').map(time => time.trim());
    }
    return [];
  };

  const handleBookNow = (pooja: Pooja, templeName: string) => {
    setSelectedPooja(pooja);
    setSelectedTempleName(templeName);
    setSelectedDate("");
    setSelectedTime("");
    setIsBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedPooja || !selectedDate || !selectedTime) return;

    const params = new URLSearchParams({
      amount: selectedPooja.price.toString(),
      templeName: selectedTempleName,
      type: 'Pooja',
      poojaId: selectedPooja.id,
      selectedDate: selectedDate,
      selectedTime: selectedTime,
    });
    if (selectedPooja.time) {
      params.append('poojaTime', selectedPooja.time);
    }
    setIsBookingDialogOpen(false);
    router.push(`/payment?${params.toString()}`);
  };

  const filteredTemples = temples.map(temple => {
      const filteredPoojas = temple.poojas.filter(pooja =>
          pooja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pooja.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (pooja.tags && pooja.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      return {...temple, poojas: filteredPoojas};
  }).filter(temple => temple.poojas.length > 0);

  return (
    <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <OmIcon className="w-10 h-10 text-primary" />
                <div>
                <h1 className="text-3xl font-headline font-bold tracking-tight">Available Poojas</h1>
                <p className="text-muted-foreground">Book a pooja to seek divine blessings from our temples.</p>
                </div>
            </div>

            <div className="mb-8">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                      placeholder="Search for a pooja by name, description, or tag..."
                      className="pl-10 text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
            </div>

            <div className="space-y-12">
                {isLoading ? (
                    Array.from({length: 2}).map((_, i) => (
                        <section key={`skeleton-section-${i}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <Skeleton className="w-16 h-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-7 w-48" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({length: 3}).map((_, j) => (
                                    <Card key={`skeleton-card-${i}-${j}`}>
                                        <Skeleton className="h-48 w-full" />
                                        <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                        <CardContent><Skeleton className="h-12 w-full" /></CardContent>
                                        <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    ))
                ) : filteredTemples.length > 0 ? (
                    filteredTemples.map((temple) => (
                        <section key={temple.id}>
                            <div className="flex items-center gap-4 mb-6">
                                <Image src={temple.image.imageUrl} alt={temple.name} width={60} height={60} className="rounded-full border-2 border-primary" data-ai-hint={temple.image.imageHint} />
                                <div>
                                    <h2 className="text-2xl font-headline font-bold">{temple.name}</h2>
                                    <p className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> {temple.location}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {temple.poojas.map((pooja, idx) => (
                                <Card key={`${temple.id}-pooja-${idx}`} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                                    {pooja.tags.map((tag, tagIdx) => (
                                        <Badge key={`${temple.id}-pooja-${idx}-tag-${tagIdx}`} variant="secondary">{tag}</Badge>
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
                                    <div>
                                        <p className="text-lg font-bold text-primary">₹{pooja.price}</p>
                                        {pooja.time && pooja.time !== 'Flexible' && (
                                            <p className="text-sm text-muted-foreground">Available: {pooja.time}</p>
                                        )}
                                    </div>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button onClick={() => handleBookNow(pooja, temple.name)}>Book Now</Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                          <DialogTitle>Book {selectedPooja?.name}</DialogTitle>
                                          <DialogDescription>
                                            Select your preferred date and time for the pooja.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                          <div className="grid grid-cols-4 items-center gap-4">
                                            <label htmlFor="date" className="text-right">
                                              Date
                                            </label>
                                            <Input
                                              id="date"
                                              type="date"
                                              value={selectedDate}
                                              onChange={(e) => setSelectedDate(e.target.value)}
                                              className="col-span-3"
                                              min={new Date().toISOString().split('T')[0]}
                                            />
                                          </div>
                                          <div className="grid grid-cols-4 items-center gap-4">
                                            <label htmlFor="time" className="text-right">
                                              Time
                                            </label>
                                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                              <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select time" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {selectedPooja && getAvailableTimes(selectedPooja).map((time) => (
                                                  <SelectItem key={time} value={time}>
                                                    {time}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                          <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={handleConfirmBooking}
                                            disabled={!selectedDate || !selectedTime}
                                          >
                                            Confirm Booking
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                </CardFooter>
                                </Card>
                            ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-lg text-muted-foreground">No poojas found for your search.</p>
                    </div>
                )}
            </div>
        </div>
    </main>
  );
}
