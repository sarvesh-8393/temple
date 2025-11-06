# TODO for Integrating MongoDB Database

- [x] Install Mongoose package
- [x] Add MongoDB URI to .env file
- [x] Create MongoDB connection in lib/db.ts
- [x] Create Mongoose models for Pooja, Temple, Product, User, Cart collections
- [ ] Update API routes (auth, cart, poojas, products, temples) to use MongoDB instead of mock data and Firebase
  - [ ] Add initial data arrays to db.ts for seeding
  - [ ] Create seed script to populate MongoDB
  - [ ] Update auth/login route to use User model
  - [ ] Update auth/signup route to use User model
  - [ ] Update cart route to use Cart model
  - [ ] Update poojas route to use Pooja model
  - [ ] Update products route to use Product model
  - [ ] Update temples route to use Temple model
  - [ ] Update temples/[id] route to use Temple model
- [ ] Remove Firebase Firestore code entirely (config, providers, hooks, etc.)
- [ ] Seed the database with initial data from db.ts
- [ ] Test the app to ensure MongoDB integration works correctly
