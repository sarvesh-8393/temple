"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { HeartHandshake } from "lucide-react";
import { DiyaIcon } from "@/components/icons";

const temple1 = PlaceHolderImages.find((img) => img.id === "temple-south");
const temple2 = PlaceHolderImages.find((img) => img.id === "temple-north");

const temples = [
  {
    id: "t1",
    name: "Sri Venkateswara Temple",
    location: "Tirupati, Andhra Pradesh",
    image: temple1,
  },
  {
    id: "t2",
    name: "Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    image: temple2,
  },
];

const presetAmounts = [51, 101, 251, 501, 1001];

export default function DonationsPage() {
  const { toast } = useToast();
  const [selectedTemple, setSelectedTemple] = useState("t1");
  const [amount, setAmount] = useState("101");

  const handleDonate = () => {
    toast({
      title: "Processing Donation...",
      description: "Please wait while we securely process your payment.",
    });

    setTimeout(() => {
      toast({
        title: "Donation Successful!",
        description: `Thank you for your generous donation of $${amount}. A confirmation email has been sent.`,
        action: (
          <div className="p-2 rounded-full bg-primary/20">
            <HeartHandshake className="text-primary" />
          </div>
        ),
      });
    }, 2000);
  };

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
            <RadioGroup
              value={selectedTemple}
              onValueChange={setSelectedTemple}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {temples.map((temple) => (
                <Label
                  key={temple.id}
                  htmlFor={temple.id}
                  className={`relative block rounded-lg border-2 bg-card p-4 cursor-pointer transition-all ${
                    selectedTemple === temple.id
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
              disabled={!amount || Number(amount) <= 0}
            >
              <HeartHandshake className="mr-2 h-5 w-5" /> Donate ${amount}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Powered by a secure payment gateway.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
