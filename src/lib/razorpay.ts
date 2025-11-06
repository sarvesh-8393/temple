import { loadRazorpay } from './utils/razorpay';

export interface PaymentDetails {
  amount: number;
  templeName: string;
  type: 'Pooja' | 'Donation';
  userId: string;
  poojaId?: string;
  templeId: string;
  name: string;
  email: string;
  contact?: string;
}

export const initializeRazorpayPayment = async (details: PaymentDetails) => {
  const response = await fetch('/api/payment/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: details.amount * 100, // Amount in paisa
    currency: "INR",
    name: "TempleConnect",
    description: `${details.type} for ${details.templeName}`,
    order_id: data.orderId,
    handler: async function (response: any) {
      try {
        const verificationResponse = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...response,
            ...details,
          }),
        });

        const verificationData = await verificationResponse.json();
        if (!verificationResponse.ok) {
          throw new Error(verificationData.message);
        }

        return verificationData;
      } catch (error) {
        console.error('Payment verification failed:', error);
        throw error;
      }
    },
    prefill: {
      name: details.name,
      email: details.email,
      contact: details.contact,
    },
    theme: {
      color: "#F59E0B"
    }
  };

  const razorpay = await loadRazorpay();
  return new Promise((resolve, reject) => {
    const paymentObject = new razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      reject(new Error(response.error.description));
    });
    paymentObject.open();
  });
};