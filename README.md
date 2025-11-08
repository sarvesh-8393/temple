# TempleConnect

A modern web application that connects devotees with temples, enabling online pooja bookings, donations, and religious product purchases.

## Features

- 🏛️ **Temple Discovery**: Browse and discover temples with interactive maps
- 📅 **Pooja Booking**: Book religious ceremonies and rituals online
- 💰 **Secure Payments**: Integrated Razorpay for safe transactions
- 🛒 **Online Store**: Purchase religious items and prasad
- 👤 **User Management**: Authentication and user profiles
- 📱 **Responsive Design**: Mobile-first approach with modern UI

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **Maps**: Google Maps API
- **Deployment**: Vercel/Netlify ready

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Razorpay account for payments
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd templeconnect
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/templeconnect
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-public-razorpay-key-id

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
templeconnect/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── (auth)/         # Authentication pages
│   │   └── ...             # Other pages
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configurations
│   ├── middleware.ts       # Next.js middleware
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@templeconnect.com or create an issue in this repository.
