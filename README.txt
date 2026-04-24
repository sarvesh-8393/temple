# TempleConnect

**A comprehensive digital platform connecting devotees with temples for spiritual services, donations, and community engagement.**

TempleConnect is a full-stack web and mobile application that bridges the gap between devotees and temples by providing a centralized ecosystem for discovering temples, booking poojas (ritual ceremonies), making donations, accessing spiritual recipes, and managing temple services online.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Module Descriptions](#module-descriptions)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)

---

## 🎯 Project Overview

TempleConnect is designed to:

- **Connect Devotees with Temples**: Enable users to discover temples near them using geolocation and map-based search
- **Facilitate Spiritual Services**: Allow booking of poojas and other temple services online
- **Enable Donations**: Provide secure payment infrastructure for temple donations and subscriptions
- **Build Community**: Share spiritual knowledge through recipes, temple information, and user profiles
- **Support Temple Management**: Enable temples to register, manage their services, and track donations
- **Cross-Platform Access**: Deliver consistent experience across web and mobile platforms

### Target Users

- **Devotees**: Individuals seeking spiritual services and temple connectivity
- **Temple Administrators**: Those managing temple operations and services
- **Premium Subscribers**: Users with advanced features and priority services

---

## 🏗️ Architecture

TempleConnect follows a **modern full-stack architecture** with clear separation of concerns:

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Frontend)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Web (Next)  │  │ Mobile (App) │  │  Shared UI   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
┌──────────────────────┴──────────────────────────────────────┐
│              API Layer (Backend Services)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth │ Temples │ Poojas │ Cart │ Payment │ Recipes  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ MongoDB Driver
┌──────────────────────┴──────────────────────────────────────┐
│                   Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   MongoDB    │  │  Cache Layer │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            External Integrations & Services                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Google Maps │  │ Razorpay Pay │  │  Google Auth │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Clear boundaries between frontend, backend, and data layers
2. **API-First Design**: Frontend and backend communicate exclusively through RESTful APIs
3. **Context-Based State Management**: Client-side state managed through React Context
4. **Token-Based Authentication**: JWT tokens for secure, stateless authentication
5. **Cross-Platform Compatibility**: Shared business logic with platform-specific implementations

---

## ✨ Core Features

### 1. **User Management & Authentication**
   - User registration and login (devotees and temple administrators)
   - Profile management with customizable bio and avatar
   - Two-tier user roles: `user` and `admin`
   - Subscription plans: `free` and `premium`
   - Persistent session management via JWT tokens

### 2. **Temple Discovery & Management**
   - Geolocation-based temple discovery
   - Interactive map view showing nearby temples
   - Temple information pages with details and images
   - Temple registration for administrators
   - Temple-to-user messaging and notifications

### 3. **Pooja (Ritual) Services**
   - Browse available poojas at each temple
   - Pooja booking and scheduling
   - Real-time availability management
   - Booking history and confirmation tracking

### 4. **E-Commerce & Cart System**
   - Shopping cart for temple services and products
   - Item management and quantity tracking
   - Cart persistence across sessions

### 5. **Payment & Donations**
   - Razorpay integration for secure payments
   - Support for donations and subscription billing
   - Payment status tracking
   - Transaction history and receipts

### 6. **Spiritual Content & Recipes**
   - Searchable database of spiritual recipes
   - User-generated content and contributions
   - Community recipes and temple-specific guides

### 7. **Mobile Application**
   - Capacitor-based Android app
   - Native geolocation capabilities
   - Offline support and notifications
   - Direct access to all web features

---

## 🔧 Module Descriptions

### **Frontend Modules** (`/src`)

#### **App Shell** (`components/app-shell.tsx`)
- **Purpose**: Root layout component that wraps the entire application
- **Responsibilities**: Navigation structure, theme management, global UI framework
- **Provides**: Consistent navigation, branding, and global UI patterns across all pages

#### **Pages** (`app/`)
The application is structured around core feature pages:

| Page | Purpose |
|------|---------|
| **Login** | User authentication and session establishment |
| **Signup** | New user registration and account creation |
| **Temples** | Browse temples with map and search capabilities |
| **Poojas** | Discover and book ritual services |
| **Store** | Browse and purchase products/services |
| **Cart** | Manage selected items before checkout |
| **Payment** | Process transactions securely |
| **Donations** | Dedicated donation interface |
| **Recipes** | Browse spiritual recipes and content |
| **Profile** | View and edit user profile information |

#### **Components** (`components/`)
Reusable UI components built on Radix UI:

- **Core Components**: Button, Card, Dialog, Input, etc.
- **Feature Components**:
  - `google-map.tsx` & `google-map-dynamic.tsx`: Map integration for temple discovery
  - `FirebaseErrorListener.tsx`: Error boundary for authentication issues
  - `logo.tsx`: Brand identity component
  - `icons.tsx`: Centralized icon library (Lucide React)

#### **Contexts** (`contexts/`)
- **AuthContext** (`auth-context.tsx`):
  - Manages global user authentication state
  - Provides user data, login/logout functions
  - Handles subscription and role information
  - Tracks booking history and user preferences

#### **Hooks** (`hooks/`)
Custom React hooks for reusable logic:
- `use-mobile.tsx`: Responsive design detection
- `use-toast.ts`: Toast notification system

#### **Types** (`types/`)
TypeScript type definitions for:
- Google Maps API types
- Next.js authentication extensions
- Project-specific domain models

#### **Styles** (`globals.css`)
- Tailwind CSS base styles
- Global typography and spacing
- Theme variables and utility classes

### **Backend Modules** (`src/app/api`)

#### **Authentication Module** (`api/auth/`)
- **Purpose**: Manage user credentials and session lifecycle
- **Responsibilities**:
  - User registration with validation
  - Login with credential verification
  - Password hashing with bcryptjs
  - JWT token generation and validation
  - Session maintenance and refresh
- **Key Operations**:
  - Register new users
  - Authenticate users
  - Logout and session termination

#### **Temples Module** (`api/temples/`)
- **Purpose**: Temple data management and discovery
- **Responsibilities**:
  - Retrieve temple listings with geolocation filtering
  - Store temple information (location, address, contact)
  - Manage temple images and metadata
  - Support temple registration by administrators
- **Key Operations**:
  - List temples by location
  - Get detailed temple information
  - Register new temple
  - Update temple details

#### **Poojas Module** (`api/poojas/`)
- **Purpose**: Ritual service management and booking
- **Responsibilities**:
  - Maintain pooja catalog with descriptions and pricing
  - Manage pooja availability and scheduling
  - Handle booking requests and confirmations
  - Track booking history per user
- **Key Operations**:
  - List available poojas
  - Create new pooja bookings
  - Update booking status
  - Retrieve booking history

#### **Cart Module** (`api/cart/`)
- **Purpose**: Shopping cart functionality
- **Responsibilities**:
  - Maintain cart items per user session
  - Calculate cart totals and pricing
  - Manage item additions and removals
  - Persist cart state
- **Key Operations**:
  - Add items to cart
  - Remove items from cart
  - Update item quantities
  - Retrieve cart contents

#### **Payment Module** (`api/payment/`)
- **Purpose**: Payment processing and transaction management
- **Responsibilities**:
  - Initialize Razorpay payment sessions
  - Validate payment callbacks
  - Record transaction details
  - Update user booking and subscription status
  - Handle refunds and payment failures
- **Key Operations**:
  - Create payment order
  - Verify payment success
  - Update donation records
  - Process subscription renewals

#### **Products Module** (`api/products/`)
- **Purpose**: Product and service catalog management
- **Responsibilities**:
  - Maintain products and services inventory
  - Manage pricing and availability
  - Handle product search and filtering
- **Key Operations**:
  - List products
  - Get product details
  - Search products

#### **Recipes Module** (`api/recipes/`)
- **Purpose**: Spiritual content and recipe management
- **Responsibilities**:
  - Maintain recipe database with ingredients and instructions
  - Support recipe creation and editing
  - Enable recipe search and filtering
  - Track user-contributed recipes
- **Key Operations**:
  - List recipes
  - Get recipe details
  - Create new recipes
  - Search recipes by keywords

#### **Update Count Module** (`api/update-count/`)
- **Purpose**: Analytics and counter management
- **Responsibilities**:
  - Track page views and engagement metrics
  - Update various counters (bookings, donations, etc.)
  - Provide analytics data
- **Key Operations**:
  - Increment view counters
  - Update aggregate statistics

### **Data Layer** (`lib/`)

#### **Database Configuration** (`mongodb.ts` / `mongodb.js`)
- **Purpose**: MongoDB connection and initialization
- **Responsibilities**:
  - Establish database connections
  - Connection pooling and lifecycle management
  - Error handling and retry logic
  - Mongoose ODM setup

#### **Data Models** (`lib/models/`)
- **Purpose**: Define MongoDB document schemas
- **Includes**:
  - User model (credentials, profile, subscription)
  - Temple model (details, location, services)
  - Pooja model (services, pricing, availability)
  - Payment/Transaction model
  - Booking model
  - Recipe model

#### **Authentication Utilities** (`lib/auth.ts`)
- **Purpose**: Cryptographic and token operations
- **Responsibilities**:
  - JWT token creation and validation
  - Password hashing with bcryptjs
  - Token expiration management
  - Claims verification

#### **Payment Utilities** (`lib/razorpay.ts`)
- **Purpose**: Razorpay API integration
- **Responsibilities**:
  - Order creation
  - Payment verification
  - Webhook handling

#### **Utility Functions** (`lib/utils.ts`)
- **Purpose**: Common helper functions
- **Includes**: Date formatting, string manipulation, validation helpers

#### **Type Definitions** (`lib/types/index.ts`)
- **Purpose**: Centralized TypeScript interfaces
- **Includes**: User, Temple, Pooja, Payment, and Booking types

#### **Placeholder Images** (`lib/placeholder-images.ts`)
- **Purpose**: Mock image data for development
- **Responsibilities**: Provide fallback images during development

### **Middleware Layer** (`middleware/`)

#### **Authentication Middleware** (`auth.ts`)
- **Purpose**: Protect routes and validate requests
- **Responsibilities**:
  - Verify JWT tokens on protected routes
  - Extract user information from tokens
  - Redirect unauthenticated requests
  - Attach user context to requests

#### **Next.js Middleware** (`middleware.ts`)
- **Purpose**: Request routing and authentication checks
- **Responsibilities**:
  - Route protection and redirection
  - Public route allowlisting (login, signup)
  - Session validation at edge

### **Mobile Application** (`/android`)

#### **Gradle Build System** (`android/`)
- **Purpose**: Android application compilation and packaging
- **Components**:
  - `build.gradle`: Project and module build configuration
  - `gradle.properties`: Build parameters and versions
  - `gradlew`: Gradle wrapper for reproducible builds

#### **App Module** (`android/app/`)
- **Purpose**: Main Android application package
- **Responsibilities**:
  - Android manifest configuration
  - Native code integration with Capacitor bridge
  - ProGuard rules for code obfuscation and optimization

---

## 💻 Technology Stack

### **Frontend**
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Data Fetching**: Fetch API
- **State Management**: React Context API

### **Backend**
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Environment Management**: dotenv

### **Database**
- **Primary Database**: MongoDB
- **ODM**: Mongoose
- **Connection Management**: MongoDB native driver

### **Integrations**
- **Maps**: Google Maps API
- **Payments**: Razorpay
- **Authentication**: JWT tokens

### **Mobile**
- **Framework**: Capacitor
- **Platform**: Android
- **Geolocation**: Capacitor Geolocation API

### **Development Tools**
- **Package Manager**: npm
- **Build Tool**: Next.js built-in build system
- **Linting**: ESLint
- **Type Checking**: TypeScript Compiler

### **Configuration Files**
- `tsconfig.json`: TypeScript configuration
- `next.config.ts`: Next.js build and runtime settings
- `tailwind.config.ts`: Tailwind CSS customization
- `postcss.config.mjs`: CSS post-processing
- `components.json`: Shadcn/ui component configuration
- `capacitor.config.ts`: Capacitor mobile app settings
- `vercel.json`: Deployment configuration for Vercel

---

## 🔗 System Components

### **Authentication Flow**
```
User Input
    ↓
[Login/Signup Page]
    ↓
[Auth API Routes]
    ↓
[Password Validation & Hashing]
    ↓
[JWT Token Generation]
    ↓
[Cookie Storage]
    ↓
[Middleware Verification]
    ↓
[Protected Route Access]
```

### **Temple Discovery Flow**
```
User Location (Geolocation)
    ↓
[Google Maps Component]
    ↓
[Temples API Route]
    ↓
[MongoDB Query (geo-spatial)]
    ↓
[Filtered Results]
    ↓
[Map Visualization]
    ↓
[Temple Selection]
    ↓
[Detailed Temple View]
```

### **Booking & Payment Flow**
```
Browse Services
    ↓
[Poojas/Products Page]
    ↓
[Add to Cart]
    ↓
[Review Cart]
    ↓
[Checkout]
    ↓
[Payment API]
    ↓
[Razorpay Integration]
    ↓
[Payment Processing]
    ↓
[Confirmation & Receipt]
    ↓
[Booking History Updated]
```

### **Content Management**
```
Admin Upload
    ↓
[CMS/Admin Panel]
    ↓
[Validation & Processing]
    ↓
[MongoDB Storage]
    ↓
[API Retrieval]
    ↓
[Frontend Rendering]
    ↓
[User Consumption]
```

---

## 🚀 Key Architectural Features

### **Scalability**
- Stateless API design allows horizontal scaling
- MongoDB clustering support for data redundancy
- JWT tokens eliminate server-side session storage

### **Security**
- JWT token-based authentication
- Password hashing with bcryptjs
- Route middleware for protection
- Environment variables for sensitive data
- Razorpay PCI compliance for payments

### **Performance**
- Next.js server-side rendering capabilities
- Component-level code splitting
- Image optimization via Next.js Image component
- Efficient database queries via Mongoose ODM

### **Maintainability**
- Modular API route structure
- Clear separation of concerns
- TypeScript for type safety
- Reusable React components and hooks
- Organized folder structure

### **User Experience**
- Responsive design with Tailwind CSS
- Real-time map integration
- Toast notifications for feedback
- Progressive Web App capabilities via Capacitor

---

## 📱 Cross-Platform Strategy

TempleConnect is designed to work seamlessly across platforms:

- **Web**: Full-featured Next.js application
- **Mobile (Android)**: Native app via Capacitor bridge
- **Shared Code**: Common TypeScript types, utilities, and business logic
- **Platform-Specific**: Native features via Capacitor plugins (geolocation, notifications)

---

## 🔄 Data Flow Architecture

### **Request Lifecycle**
1. User interaction on frontend
2. API request dispatched to Next.js API route
3. Middleware validates authentication and authorization
4. Business logic processes request
5. Database query/mutation executed
6. Response returned to client
7. Frontend updates UI state

### **State Management Strategy**
- **Global State**: User authentication via AuthContext
- **Component State**: Local UI state via React useState
- **Server State**: Data fetched and cached on-demand
- **Persistent State**: Tokens stored in HTTP-only cookies

---

## 📊 Entity Relationships

```
User (1) ──── (M) Bookings
  |
  └── (1) Profile
  
Temple (1) ──── (M) Poojas
  |
  └── (1) Services

Booking ──── Pooja
  |
  └── Temple

Payment (1) ──── (1) Booking/Donation
```

---

## 🛠️ Development Workflow

The application is structured to support:

- **Feature Development**: Add new pages in `app/`, API routes in `api/`, and models in `lib/models/`
- **Component Development**: Create reusable components in `components/` with Radix UI
- **Bug Fixes**: Isolated to specific modules without affecting others
- **Testing**: API routes testable independently via HTTP requests
- **Deployment**: Vercel-ready configuration for seamless CI/CD

---

## 📝 Notes

- The application uses MongoDB as the source of truth for all data
- All communication happens through REST APIs
- Frontend and backend are loosely coupled
- Mobile app shares the same backend as web application
- Payment integration is abstracted through Razorpay API layer

---

**Last Updated**: April 2026
