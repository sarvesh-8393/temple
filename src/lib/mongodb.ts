import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/temple';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Models
const templeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  image: {
    imageUrl: String,
    imageHint: String
  },
  poojas: [{
    name: String,
    description: String,
    price: Number,
    image: {
      imageUrl: String,
      imageHint: String
    },
    tags: [String],
    date: String,
    time: String
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  }
});

const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  bio: String,
  bookingHistory: [{
    type: { type: String, enum: ['Pooja', 'Donation'], required: true },
    amount: { type: Number, required: true },
    templeName: { type: String, required: true },
    poojaId: String,
    templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
  }]
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    imageUrl: String,
    imageHint: String
  },
  category: String,
  inStock: { type: Boolean, default: true }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

// Define and export models
export const Temple = mongoose.models.Temple || mongoose.model('Temple', templeSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);