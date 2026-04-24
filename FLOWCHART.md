# TempleConnect - Core System Flowcharts

Simple, focused flowcharts for each major feature of the TempleConnect application.

---

## 1️⃣ Login & Authentication Flow

```mermaid
graph TD
    A[User Opens App] --> B{Logged In?}
    B -->|Yes| C[Go to Home]
    B -->|No| D[Show Login Page]
    
    D --> E[Enter Email & Password]
    E --> F[Validate Input]
    F --> G{Valid?}
    G -->|No| H[Show Error]
    H --> E
    G -->|Yes| I[Send to Auth API]
    
    I --> J[Query User from DB]
    J --> K{User Found?}
    K -->|No| L[Show Invalid Error]
    L --> E
    K -->|Yes| M[Compare Password Hash]
    
    M --> N{Password Match?}
    N -->|No| L
    N -->|Yes| O[Create JWT Token]
    
    O --> P[Store Token in Cookie]
    P --> Q[Update Auth Context]
    Q --> C
```

---

## 2️⃣ Temple Discovery & Map View

```mermaid
graph TD
    A[Home Page Loads] --> B[Request GPS Location]
    B --> C{Permission OK?}
    
    C -->|Denied| D[Manual Location Input]
    C -->|Allowed| E[Get User Lat/Lng]
    D --> E
    
    E --> F[Call Temples API]
    F --> G[Query Temples Near User]
    G --> H[Get Crowd Count for Each]
    
    H --> I[Return Temple List]
    I --> J[Show Google Map]
    J --> K[Plot Temple Markers]
    
    K --> L{User Action}
    L -->|Click Temple| M[Show Temple Details]
    L -->|Change View| N[Show List View]
```

---

## 3️⃣ Pooja Booking Flow

```mermaid
graph TD
    A[View Temple Details] --> B[Browse Available Poojas]
    B --> C[Click on Pooja]
    C --> D[View Price & Details]
    
    D --> E{Want to Book?}
    E -->|Yes| F[Add to Cart]
    E -->|No| B
    
    F --> G[Cart Item Added]
    G --> H{Continue Shopping?}
    H -->|Yes| I[Browse More Poojas]
    H -->|No| J[Review Cart]
    
    I --> B
    J --> K[View Cart Items]
    K --> L[See Total Price]
    L --> M[Proceed to Checkout]
```

---

## 4️⃣ Razorpay Payment Processing

```mermaid
graph TD
    A[Click Pay Button] --> B[Call Payment API]
    B --> C[Create Razorpay Order]
    C --> D[Get Order ID]
    
    D --> E[Load Payment Modal]
    E --> F[User Enters Card/UPI]
    F --> G[Razorpay Processes]
    
    G --> H{Payment Status}
    H -->|Failed| I[Show Error]
    I --> J[Retry or Cancel]
    H -->|Success| K[Get Payment ID]
    
    K --> L[Verify Signature]
    L --> M{Valid?}
    M -->|No| N[Reject Payment]
    N --> I
    M -->|Yes| O[Save Transaction]
    
    O --> P[Create Booking]
    P --> Q[Update DB]
    Q --> R[Send Confirmation Email]
    R --> S[Show Receipt]
```

---

## 5️⃣ Crowd Sensor Integration

```mermaid
graph TD
    A[IoT Sensor at Temple] --> B[Person Entry/Exit]
    B --> C[Update Count]
    C --> D[Send to Backend]
    
    D --> E[Update-Count API]
    E --> F[Update Crowd Model]
    F --> G[Save to MongoDB]
    
    G --> H{User Views Temple?}
    H -->|Yes| I[Fetch Crowd Data]
    I --> J[Show Crowd Level]
    J --> K[Green/Yellow/Red Indicator]
    
    K --> L{Crowd Acceptable?}
    L -->|Too Crowded| M[Browse Other Temple]
    L -->|OK| N[Proceed to Book]
```

---

## 6️⃣ Shopping Cart Management

```mermaid
graph TD
    A[Add Item to Cart] --> B[Store in State]
    B --> C[Show Toast]
    
    C --> D{More Items?}
    D -->|Yes| E[Browse More]
    D -->|No| F[View Cart]
    
    E --> A
    F --> G[List All Items]
    G --> H[Calculate Subtotal]
    H --> I[Add Tax]
    I --> J[Show Final Total]
    
    J --> K{Modify Cart?}
    K -->|Remove Item| L[Delete Item]
    K -->|Update Qty| M[Change Quantity]
    K -->|Checkout| N[Go to Payment]
    
    L --> F
    M --> F
```

---

## 7️⃣ User Profile & Booking History

```mermaid
graph TD
    A[Click Profile Icon] --> B[Load Profile Page]
    B --> C[Show User Info]
    C --> D[Name, Email, Avatar]
    
    D --> E[Fetch Booking History]
    E --> F[Query from DB]
    F --> G[List All Bookings]
    
    G --> H[Show Temple Name]
    H --> I[Show Pooja Name]
    I --> J[Show Date & Amount]
    J --> K[Show Status]
    
    K --> L{User Action}
    L -->|View Full Details| M[Show Complete Info]
    L -->|Download Receipt| N[Generate PDF]
    L -->|Cancel Booking| O[Request Cancellation]
    L -->|Rebook| P[Pre-fill Form]
```

---

## Quick Reference

| Flow | Purpose | Key Steps |
|------|---------|-----------|
| **Login** | Authenticate user | Email → Password → Hash → JWT → Store |
| **Temples** | Discover nearby temples | GPS → Query → Crowd Data → Map View |
| **Booking** | Book a pooja | Browse → Add Cart → Review → Checkout |
| **Payment** | Process payment | Order → Modal → Process → Verify → Receipt |
| **Crowd** | Real-time crowd tracking | IoT → Update → Display → User Decision |
| **Cart** | Manage items | Add → List → Calculate → Modify → Checkout |
| **Profile** | View booking history | Load → Fetch → Display → Actions |

---

**Total Flows**: 7 core flowcharts covering all major user journeys
**Focus**: Simple, clear, easy to understand and follow
**Updated**: April 2026
```
