export const loadRazorpay = () => {
  return new Promise<any>((resolve, reject) => {
    if ((window as any).Razorpay) {
      resolve((window as any).Razorpay);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve((window as any).Razorpay);
    };
    script.onerror = (e) => {
      reject(e);
    };
    document.body.appendChild(script);
  });
};