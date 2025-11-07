"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Smartphone, QrCode, ArrowRight, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QrScanner from 'qr-scanner';

export default function PayPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleSendMoney = async () => {
    if (!phoneNumber || !amount) {
      toast({
        title: "Error",
        description: "Please enter both phone number and amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create Razorpay order
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Convert to paisa
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_key_here", // Fallback for test mode
          amount: orderData.amount,
          currency: orderData.currency,
          name: "TempleConnect UPI App",
          description: `Send ₹${amount} to ${phoneNumber}`,
          order_id: orderData.orderId,
          method: {
            upi: true,
          },
          handler: function (response: any) {
            toast({
              title: "Payment Successful",
              description: `Payment of ₹${amount} sent to ${phoneNumber}`,
            });
            setPhoneNumber("");
            setAmount("");
          },
          prefill: {
            contact: phoneNumber,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startQRScan = async () => {
    if (!videoRef.current) return;

    setIsScanning(true);
    try {
      const scanner = new QrScanner(
        videoRef.current,
        async (result) => {
          console.log('QR Code detected:', result);
          scanner.stop();

          // Parse QR code data (assuming it contains payment info)
          const qrData = result.data;
          let paymentAmount = 100; // Default amount
          let merchantName = "Merchant";

          // Try to extract amount from QR data (basic parsing)
          const amountMatch = qrData.match(/am=([0-9]+)/);
          if (amountMatch) {
            paymentAmount = parseInt(amountMatch[1]);
          }

          // Extract merchant name if available
          const nameMatch = qrData.match(/pn=([^&]+)/);
          if (nameMatch) {
            merchantName = decodeURIComponent(nameMatch[1]);
          }

          setIsScanning(false);

          // Create Razorpay order for the scanned QR
          const response = await fetch("/api/payment/initialize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: paymentAmount * 100, // Convert to paisa
              currency: "INR",
              receipt: `receipt_qr_${Date.now()}`,
            }),
          });

          const orderData = await response.json();

          if (!response.ok) {
            throw new Error(orderData.error || "Failed to create order");
          }

          // Load Razorpay script
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          document.body.appendChild(script);

          script.onload = () => {
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_key_here",
              amount: orderData.amount,
              currency: orderData.currency,
              name: "TempleConnect UPI App",
              description: `Pay ${merchantName} - ₹${paymentAmount}`,
              order_id: orderData.orderId,
              method: {
                upi: true,
              },
              handler: function (response: any) {
                toast({
                  title: "QR Payment Successful",
                  description: `Payment of ₹${paymentAmount} to ${merchantName} completed`,
                });
              },
              prefill: {
                contact: "9999999999",
              },
              theme: {
                color: "#3399cc",
              },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          };
        },
        {
          onDecodeError: (err) => {
            console.log('QR decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scanner.start();
    } catch (error) {
      console.error("QR scan error:", error);
      toast({
        title: "QR Scan Failed",
        description: "Unable to access camera or scan QR code.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopQRScan = () => {
    setIsScanning(false);
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Mini UPI App</h1>
          <p className="text-muted-foreground">Send money or scan QR codes - Test Mode</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Send Money Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Send Money to Mobile Number
              </CardTitle>
              <CardDescription>
                Enter recipient's phone number and amount to send money
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSendMoney}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Send Money"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Scan QR Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Scan QR → Pay Merchant
              </CardTitle>
              <CardDescription>
                Scan QR codes to pay merchants instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isScanning ? (
                <div className="text-center py-4">
                  <video
                    ref={videoRef}
                    className="w-full max-w-sm mx-auto border rounded-lg mb-4"
                    playsInline
                    muted
                  />
                  <p className="text-sm text-muted-foreground mb-4">
                    Scanning for QR code... Point your camera at a QR code
                  </p>
                  <Button onClick={stopQRScan} variant="outline">
                    Stop Scanning
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Click below to open camera and scan QR codes
                  </p>
                  <Button onClick={startQRScan} variant="outline">
                    <Camera className="mr-2 h-4 w-4" />
                    Open Camera & Scan QR
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Mode Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              What Happens in Your Mini UPI App (In Test Mode)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold">"Send Money to Mobile Number"</h4>
                  <p className="text-sm text-muted-foreground">
                    User enters phone + amount. Razorpay order created. Razorpay test checkout opens.
                    Click "Pay with UPI". Click "Success". Razorpay confirms payment. Webhook fires.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold">"Scan QR → Pay Merchant"</h4>
                  <p className="text-sm text-muted-foreground">
                    Since it's test mode: QR scanning works. Payment still happens in the test checkout.
                    No actual merchant is paid.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
