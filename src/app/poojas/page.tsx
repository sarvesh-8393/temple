
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { type Pooja, temples } from "@/lib/db";
import { Input } from "@/components/ui/input";

export default function PoojasPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleBookNow = (pooja: Pooja, templeName: string) => {
    router.push(
      `/payment?amount=${pooja.price}&templeName=${encodeURIComponent(
        templeName
      )}&type=Pooja`
    );
  };

  const filteredTemples = temples.map(temple => {
      const filteredPoojas = temple.poojas.filter(pooja => 
          pooja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pooja.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pooja.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
                {filteredTemples.length > 0 ? (
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
