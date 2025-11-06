"use client";

import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Star, User } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar-1");
const premiumBg = PlaceHolderImages.find((img) => img.id === "premium-plan");

export default function ProfilePage() {
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: "Upgrading to Premium",
      description: "You're being redirected to our secure payment page.",
    });

    setTimeout(() => {
      toast({
        title: "Welcome to Premium!",
        description:
          "Your membership has been upgraded. Enjoy your new benefits!",
      });
    }, 3000);
  };

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
          <Avatar className="w-24 h-24 border-4 border-primary">
            <AvatarImage
              src={userAvatar?.imageUrl}
              data-ai-hint={userAvatar?.imageHint}
            />
            <AvatarFallback>DU</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-headline font-bold">
                Devotee User
              </h1>
              <Badge variant="outline" className="border-accent text-accent">
                <Star className="w-3 h-3 mr-1" />
                Premium Member
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              devotee.user@example.com
            </p>
            <p className="mt-4">
              A passionate devotee dedicated to spiritual growth and supporting
              temple communities.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-headline font-semibold mb-4">
            Manage Subscription
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <Card className="shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>
                  Basic access to our community and services.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <span>Browse temples and poojas</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <span>Make donations</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <span>Purchase from store</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled className="w-full">
                  Currently Active
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-lg border-2 border-accent relative flex flex-col">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Recommended
              </Badge>
              {premiumBg && (
                <Image
                  src={premiumBg.imageUrl}
                  alt="Premium background"
                  fill
                  className="object-cover opacity-10 absolute inset-0 z-0"
                  data-ai-hint={premiumBg.imageHint}
                />
              )}
              <div className="relative z-10 flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle className="text-accent">Premium Plan</CardTitle>
                  <CardDescription>
                    Unlock exclusive benefits and support us more.
                  </CardDescription>
                  <p className="text-3xl font-bold pt-2">
                    $9.99<span className="text-sm font-normal">/month</span>
                  </p>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>All benefits of the Free Plan</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>10% discount on all pooja bookings</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>5% discount on all store items</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>Premium member badge on profile</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpgrade} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Star className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
