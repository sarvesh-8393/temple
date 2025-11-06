
'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { user } from '@/lib/db';
import { CreditCard, Zap } from 'lucide-react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const amount = searchParams.get('amount') || '0';
  const templeName = searchParams.get('templeName') || 'the temple';
  const type = searchParams.get('type') || 'Payment';
  
  const handlePayment = () => {
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(amount) * 100, // Amount is in currency subunits.
        currency: "INR",
        name: "TempleConnect",
        description: `${type} for ${templeName}`,
        image: "https://images.unsplash.com/photo-1621787084849-ed98731b3071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxpbmRpYW4lMjB0ZW1wbGV8ZW58MHx8fHwxNzYyMzUyMzMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        handler: function (response: any){
            toast({
                title: "Payment Successful!",
                description: `Payment ID: ${response.razorpay_payment_id}`,
            });
            router.push('/');
        },
        prefill: {
            name: user.displayName,
            email: user.email,
            contact: "9999999999" // This should be dynamic in a real app
        },
        notes: {
            address: "TempleConnect Corporate Office"
        },
        theme: {
            "color": "#F59E0B" // Using primary color from theme
        }
    };
    
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast({
        title: "Configuration Error",
        description: "Razorpay Key ID is not configured. Please set it in your environment variables.",
        variant: "destructive"
      });
      return;
    }
    
    if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
                toast({
                    title: "Payment Failed",
                    description: `${response.error.description} (Code: ${response.error.code})`,
                    variant: "destructive"
                });
        });
        rzp.open();
    } else {
        toast({
            title: "Error",
            description: "Razorpay script not loaded. Please check your internet connection and try again.",
            variant: "destructive"
        })
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
            You are about to make a {type.toLowerCase()} of ${amount} to {templeName}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-lg p-4 border rounded-lg">
                <span>Total Amount (USD estimate):</span>
                <span className="font-bold text-2xl text-primary">${amount}</span>
            </div>
            <p className='text-sm text-muted-foreground'>
                You will be charged in INR. The final amount will be converted based on the current exchange rate.
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
