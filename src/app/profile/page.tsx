
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

const premiumBg = PlaceHolderImages.find((img) => img.id === 'premium-plan');

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Refresh user data when component mounts to ensure latest plan status
    refreshUser();
  }, []);

  const handleUpgrade = () => {
    router.push('/payment?amount=499&templeName=TempleConnect&type=Premium%20Subscription');
  };

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-start gap-8 sm:flex-row">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage
              src={user?.photoURL}
            />
            <AvatarFallback>
              {mounted ? (
                user?.displayName
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('') ||
                user?.email?.charAt(0).toUpperCase() ||
                'U'
              ) : (
                'U'
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="font-headline text-3xl font-bold">
                {user?.displayName || 'Devotee User'}
              </h1>
              <Badge variant="outline" className="border-accent text-accent">
                <Star className="mr-1 h-3 w-3" />
                {user?.plan === 'premium' ? 'Premium Member' : 'Free Member'}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {user?.email || 'devotee.user@example.com'}
            </p>
            <p className="mt-4">
              {user?.bio || 'A devoted temple visitor.'}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 font-headline text-2xl font-semibold">
            Manage Subscription
          </h2>
          <div className="grid items-stretch gap-8 md:grid-cols-2">
            <Card className="flex flex-col shadow-lg">
              <CardHeader>
                <CardTitle>{user?.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}</CardTitle>
                <CardDescription>
                  {user?.plan === 'premium' ? 'Your current premium membership benefits.' : 'Basic access to our community and services.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${user?.plan === 'premium' ? 'text-accent' : 'text-muted-foreground'}`} />
                  <span>Browse temples and poojas</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${user?.plan === 'premium' ? 'text-accent' : 'text-muted-foreground'}`} />
                  <span>Make donations</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${user?.plan === 'premium' ? 'text-accent' : 'text-muted-foreground'}`} />
                  <span>Purchase from store</span>
                </p>
                {user?.plan === 'premium' && (
                  <>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>10% discount on all pooja bookings</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>5% discount on all store items</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>Premium member badge on profile</span>
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled className="w-full">
                  Currently Active
                </Button>
              </CardFooter>
            </Card>

            {user?.plan !== 'premium' && (
              <Card className="relative flex flex-col border-2 border-accent shadow-lg">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Recommended
                </Badge>
                {premiumBg && (
                  <Image
                    src={premiumBg.imageUrl}
                    alt="Premium background"
                    fill
                    className="absolute inset-0 z-0 object-cover opacity-10"
                    data-ai-hint={premiumBg.imageHint}
                  />
                )}
                <div className="relative z-10 flex flex-grow flex-col">
                  <CardHeader>
                    <CardTitle className="text-accent">Premium Plan</CardTitle>
                    <CardDescription>
                      Unlock exclusive benefits and support us more.
                    </CardDescription>
                    <p className="pt-2 text-3xl font-bold">
                      ₹499<span className="text-sm font-normal">/month</span>
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>All benefits of the Free Plan</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>10% discount on all pooja bookings</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>5% discount on all store items</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>Premium member badge on profile</span>
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleUpgrade}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Upgrade to Premium
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
