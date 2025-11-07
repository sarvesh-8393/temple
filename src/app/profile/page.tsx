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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle, Star, FileText, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

const premiumBg = PlaceHolderImages.find((img) => img.id === 'premium-plan');

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Refresh user data when component mounts to ensure latest plan status
    refreshUser();
  }, []);

  useEffect(() => {
    // Check if we should show receipt modal from URL params
    if (mounted && user && user.bookingHistory && user.bookingHistory.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('showReceipt') === 'true') {
        // Show the most recent booking
        const latestBooking = user.bookingHistory.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        setSelectedBooking(latestBooking);
        setShowReceiptModal(true);
        // Clean up URL
        router.replace('/profile', undefined);
      }
    }
  }, [user, router, mounted]);

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
                {mounted ? (user?.displayName || 'Devotee User') : 'Devotee User'}
              </h1>
              <Badge variant="outline" className="border-accent text-accent">
                <Star className="mr-1 h-3 w-3" />
                {mounted ? (user?.plan === 'premium' ? 'Premium Member' : 'Free Member') : 'Free Member'}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {mounted ? (user?.email || 'devotee.user@example.com') : 'devotee.user@example.com'}
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

        <div className="mb-10">
          <h2 className="mb-4 font-headline text-2xl font-semibold">
            Booking History & Receipts
          </h2>
          <div className="space-y-4">
            {user?.bookingHistory && user.bookingHistory.length > 0 ? (
              user.bookingHistory
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((booking: any, index: number) => (
                  <Card key={booking.paymentId || index} className="shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{booking.type} Receipt</CardTitle>
                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {booking.templeName} • {new Date(booking.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Payment ID</p>
                          <p className="text-muted-foreground">{booking.paymentId}</p>
                        </div>
                        <div>
                          <p className="font-medium">Order ID</p>
                          <p className="text-muted-foreground">{booking.orderId}</p>
                        </div>
                        <div>
                          <p className="font-medium">Amount</p>
                          <p className="text-muted-foreground">₹{booking.amount}</p>
                        </div>
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground">{booking.type}</p>
                        </div>
                      </div>
                      {booking.poojaId && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="font-medium">Pooja ID</p>
                          <p className="text-muted-foreground">{booking.poojaId}</p>
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              View Receipt
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {booking.type} Receipt
                              </DialogTitle>
                              <DialogDescription>
                                Complete details of your booking
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Temple:</span>
                                <span>{booking.templeName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Date:</span>
                                <span>{new Date(booking.date).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Time:</span>
                                <span>{new Date(booking.date).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Amount:</span>
                                <span>₹{booking.amount}</span>
                              </div>
                              <div className="border-t pt-4 space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">Payment ID:</span>
                                  <p className="text-muted-foreground font-mono text-xs">{booking.paymentId}</p>
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Order ID:</span>
                                  <p className="text-muted-foreground font-mono text-xs">{booking.orderId}</p>
                                </div>
                                {booking.poojaId && (
                                  <div className="text-sm">
                                    <span className="font-medium">Pooja ID:</span>
                                    <p className="text-muted-foreground font-mono text-xs">{booking.poojaId}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t">
                                <span className="font-medium">Status:</span>
                                <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                                  {booking.status}
                                </Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Card className="shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">No booking history yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your receipts will appear here after making payments.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal for Latest Booking */}
      {selectedBooking && (
        <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedBooking.type} Receipt
              </DialogTitle>
              <DialogDescription>
                Complete details of your latest booking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Temple:</span>
                <span>{selectedBooking.templeName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>
                <span>{new Date(selectedBooking.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Time:</span>
                <span>{new Date(selectedBooking.date).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Amount:</span>
                <span>₹{selectedBooking.amount}</span>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Payment ID:</span>
                  <p className="text-muted-foreground font-mono text-xs">{selectedBooking.paymentId}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Order ID:</span>
                  <p className="text-muted-foreground font-mono text-xs">{selectedBooking.orderId}</p>
                </div>
                {selectedBooking.poojaId && (
                  <div className="text-sm">
                    <span className="font-medium">Pooja ID:</span>
                    <p className="text-muted-foreground font-mono text-xs">{selectedBooking.poojaId}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Status:</span>
                <Badge variant={selectedBooking.status === 'completed' ? 'default' : 'secondary'}>
                  {selectedBooking.status}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
