
'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { initializeRazorpayPayment } from '@/lib/razorpay';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Zap } from 'lucide-react';

const initialUser = {
    id: "test_user_id", // This should come from your auth context
    displayName: "Test User",
    email: "test@example.com"
};

declare global {
    interface Window {
        Razorpay: any;
    }
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const amount = searchParams.get('amount') || '0';
  const templeName = searchParams.get('templeName') || 'the temple';
  const type = searchParams.get('type') || 'Payment';
  
  const handlePayment = async () => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to make a payment",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }
      
      if (!amount || !templeName || !type || !user) {
        toast({
          title: "Error",
          description: "Missing required payment details",
          variant: "destructive"
        });
        return;
      }

      const paymentDetails: any = {
        amount: Number(amount),
        templeName,
        type: type as 'Pooja' | 'Donation',
        userId: user._id,
        name: user.displayName,
        email: user.email,
      };
      const templeId = searchParams.get('templeId');
      if (templeId && templeId.length === 24) paymentDetails.templeId = templeId;
      const poojaId = searchParams.get('poojaId');
      if (poojaId && poojaId.length === 24) paymentDetails.poojaId = poojaId;

      await initializeRazorpayPayment(paymentDetails);

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });
      
      router.push('/profile'); // Redirect to profile to see booking history
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <CreditCard className="h-6 w-6" />
            Confirm Your Payment
          </CardTitle>
          <CardDescription>
            You are about to make a {type.toLowerCase()} of ₹{amount} to {templeName}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-lg p-4 border rounded-lg">
                <span>Total Amount (₹):</span>
                <span className="font-bold text-2xl text-primary">₹{amount}</span>
            </div>
            <p className='text-sm text-muted-foreground'>
                The amount shown is in Indian Rupees (₹).
            </p>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full text-lg font-bold" onClick={handlePayment}>
            <Zap className="mr-2 h-5 w-5" /> Pay with Razorpay
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentPageContent />
        </Suspense>
    )
}
