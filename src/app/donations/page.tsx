
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HeartHandshake, Search } from "lucide-react";
import { DiyaIcon } from "@/components/icons";
import { type Temple } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

const presetAmounts = [51, 101, 251, 501, 1001];

export default function DonationsPage() {
  const router = useRouter();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTempleId, setSelectedTempleId] = useState("");
  const [amount, setAmount] = useState("101");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/temples");
        const data = await res.json();
        setTemples(data);
        if (data.length > 0) {
          setSelectedTempleId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch temples:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const handleDonate = () => {
    const temple = temples.find(t => t.id === selectedTempleId);
    if (temple) {
        router.push(
            `/payment?amount=${amount}&templeId=${selectedTempleId}&templeName=${encodeURIComponent(
                temple.name
            )}&type=Donation`
        );
    }
  };
  
  const filteredTemples = temples.filter(temple => 
    temple.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <DiyaIcon className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">
              Make a Donation
            </h1>
            <p className="text-muted-foreground">
              Your support helps maintain our temples and their services.
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Choose a Temple</CardTitle>
            <CardDescription>
              Select the temple you wish to support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 max-w-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for a temple..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({length: 2}).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                            <Skeleton className="w-20 h-20 rounded-md"/>
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32"/>
                                <Skeleton className="h-4 w-24"/>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <RadioGroup
                value={selectedTempleId}
                onValueChange={setSelectedTempleId}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                {filteredTemples.map((temple) => (
                    <Label
                    key={temple.id}
                    htmlFor={temple.id}
                    className={`relative block rounded-lg border-2 bg-card p-4 cursor-pointer transition-all ${
                        selectedTempleId === temple.id
                        ? "border-primary ring-2 ring-primary"
                        : "border-border"
                    }`}
                    >
                    <RadioGroupItem
                        value={temple.id}
                        id={temple.id}
                        className="sr-only"
                    />
                    <div className="flex items-start gap-4">
                        {temple.image && (
                        <Image
                            src={temple.image.imageUrl}
                            alt={temple.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover aspect-square"
                            data-ai-hint={temple.image.imageHint}
                        />
                        )}
                        <div>
                        <p className="font-semibold text-card-foreground">
                            {temple.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {temple.location}
                        </p>
                        </div>
                    </div>
                    </Label>
                ))}
                </RadioGroup>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Enter Amount</CardTitle>
            <CardDescription>
              Choose a preset amount or enter a custom one. All donations are in
              USD.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === String(preset) ? "default" : "outline"}
                  onClick={() => setAmount(String(preset))}
                  className="text-lg font-semibold"
                >
                  ${preset}
                </Button>
              ))}
              <Input
                type="number"
                placeholder="Custom"
                className="text-lg font-semibold h-full col-span-3 md:col-span-1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button
              size="lg"
              className="w-full text-lg font-bold"
              onClick={handleDonate}
              disabled={!amount || Number(amount) <= 0 || !selectedTempleId || isLoading}
            >
              <HeartHandshake className="mr-2 h-5 w-5" /> Proceed to Pay ${amount}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              You will be redirected to our secure payment gateway.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
