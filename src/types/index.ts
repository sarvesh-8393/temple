export interface Temple {
  id: string;
  name: string;
  location: string;
  address?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  description?: string;
  image?: {
    imageUrl: string;
    imageHint?: string;
  };
  poojas?: Pooja[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface Pooja {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: {
    imageUrl: string;
    imageHint?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: {
    imageUrl: string;
    imageHint?: string;
  };
  category?: string;
  inStock?: boolean;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  plan?: 'free' | 'premium';
  bio?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total?: number;
}