# Pooja Image Fixer Scripts

These scripts fix missing image fields in temple poojas in MongoDB.

## Problem

When poojas are updated via the API, the `image` field with `imageUrl` may not be included in the pooja object, causing images to disappear on the frontend.

### Document Structure

Each temple document has poojas with an image object:

```json
{
  "name": "Sri Varasiddhi Vinayaka Temple",
  "poojas": [
    {
      "name": "Archana",
      "description": "Archana Pooja description...",
      "price": 60,
      "image": {
        "imageUrl": "https://images.unsplash.com/photo-1705952484283..."
      },
      "time": "9:00 AM,11:00 AM,1:00 PM"
    }
  ]
}
```

**Missing Image**: When a pooja has no `image` or `image.imageUrl`, the script adds it.

---

## Available Scripts

### 1. Fix Single Temple (Node.js)

**File**: `fix-pooja-images.js`

Fix a single temple by its MongoDB ID:

```bash
node scripts/fix-pooja-images.js <templeId>
```

**Example**:
```bash
node scripts/fix-pooja-images.js 60d5ec49c1234567890abcde
```

**Output**:
```
🏛️  Pooja Image Fixer Script
==========================

🔗 Connecting to MongoDB...
✅ Connected to MongoDB

📖 Loading temple with ID: 60d5ec49c1234567890abcde
✅ Found temple: Sri Venkateswara Temple

🔍 Checking poojas for missing images...

  ⚠️  Pooja 1: "Abhisheka" - MISSING IMAGE
     ✅ Added default image

  ✓ Pooja 2: "Havan" - has image

📊 Summary:
   Total poojas: 2
   Missing images: 1
   Fixed: 1

💾 Saving temple to MongoDB...
✅ Temple saved successfully!

🎉 All missing pooja images have been fixed!
```

---

### 2. Fix All Temples (Node.js)

**File**: `fix-all-temples.js`

Fix all temples in the database:

```bash
node scripts/fix-all-temples.js
```

**Output**:
```
🏛️  Fix All Temples - Pooja Images Script
==========================================

🔗 Connecting to MongoDB...
✅ Connected to MongoDB

📖 Loading all temples...
✅ Found 5 temples

[1/5] Processing: Sri Venkateswara Temple
──────────────────────────────────────────────────
  ⚠️  Pooja 1: "Abhisheka" - MISSING IMAGE
     ✅ Added default image
  💾 Saved 1 fix(es)

[2/5] Processing: Kashi Vishwanath Temple
──────────────────────────────────────────────────
  ✓ All poojas have images

...

==================================================
📊 FINAL SUMMARY
==================================================
   Total temples: 5
   Temples with issues: 2
   Total missing images fixed: 3

🎉 Successfully fixed all missing pooja images!
```

---

### 3. Fix Using npm Scripts

Add these to your `package.json` and use npm commands:

```bash
# Fix a single temple
npm run fix-poojas:one <templeId>

# Fix all temples
npm run fix-poojas:all
```

Example:
```bash
npm run fix-poojas:one 60d5ec49c1234567890abcde
npm run fix-poojas:all
```

---

## What Gets Fixed

The scripts:
1. ✅ Connect to MongoDB using credentials from `.env.local`
2. ✅ Load temples from the database
3. ✅ Check each pooja for the `image.imageUrl` field
4. ✅ Add default image object if missing:
   ```javascript
   {
     id: 'pooja-default',
     imageUrl: 'https://images.unsplash.com/photo-1705952484283-19c31e37e0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmaXJlJTIwcml0dWFsfGVufDB8fHx8MTc2MjMyNjE0M3ww&ixlib=rb-4.1.0&q=80&w=1080'
   }
   ```
5. ✅ Save temples back to MongoDB
6. ✅ Display detailed logs of what was fixed

### Before (Missing Image)
```javascript
{
  "name": "Archana",
  "description": "...",
  "price": 60
  // ❌ No image field
}
```

### After (Image Added)
```javascript
{
  "name": "Archana",
  "description": "...",
  "price": 60,
  "image": {
    "id": "pooja-default",
    "imageUrl": "https://images.unsplash.com/photo-1705952484283-19c31e37e0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmaXJlJTIwcml0dWFsfGVufDB8fHx8MTc2MjMyNjE0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
  }
}
```

---

## How It Works

### Default Image URL

All missing poojas get this default placeholder image:
```
https://images.unsplash.com/photo-1588271891507-24ca91f33ca5?w=500&h=500&fit=crop
```

This is the same image used when creating new temples.

### Data Structure Added

Each pooja gets this image object added:

```javascript
pooja.image = {
  id: 'pooja-default',
  imageUrl: 'https://images.unsplash.com/photo-1705952484283-19c31e37e0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmaXJlJTIwcml0dWFsfGVufDB8fHx8MTc2MjMyNjE0M3ww&ixlib=rb-4.1.0&q=80&w=1080'
}
```

### Checking Logic

The script checks if either condition is true:
- `!pooja.image` - No image object exists
- `!pooja.image.imageUrl` - Image object exists but URL is missing/empty

If either is true, a default image URL is added.

---

## Requirements

- Node.js (v14+)
- MongoDB connection string in `.env.local`
- All dependencies installed (`npm install`)

### .env.local

Make sure your `.env.local` has:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/temple-db
```

---

## Usage Examples

### Get Temple ID

First, get a temple ID from your MongoDB. You can:

1. Use MongoDB Compass to browse collections
2. Check API response from GET `/api/temples`
3. Get from your admin panel or database dump

```bash
# Example IDs
60d5ec49c1234567890abcde
507f1f77bcf86cd799439011
```

### Run Single Temple Fix

```bash
node scripts/fix-pooja-images.js 60d5ec49c1234567890abcde
```

### Run All Temples Fix

```bash
node scripts/fix-all-temples.js
```

---

## Error Handling

### Temple Not Found
```
❌ Temple not found with that ID
```
**Solution**: Check the temple ID and make sure it exists in MongoDB

### Connection Failed
```
❌ Error: connect ECONNREFUSED
```
**Solution**: Verify MongoDB URI in `.env.local`

### No .env.local
```
❌ Error: Cannot find module
```
**Solution**: Create `.env.local` with `MONGODB_URI` set

---

## TypeScript Version

For TypeScript usage:

```bash
ts-node scripts/fix-poojas.ts fix-one <templeId>
ts-node scripts/fix-poojas.ts fix-all
```

---

## Prevention

To prevent this issue in the future:

1. ✅ Always include the `image` field when creating poojas
2. ✅ Keep the fix applied in the PUT route (already done in `[id]/route.ts`)
3. ✅ When updating poojas, ensure image data is preserved

---

## Questions?

If you need to:
- Fix just one temple: Use `fix-pooja-images.js`
- Fix all temples at once: Use `fix-all-temples.js`
- Use TypeScript: Use `fix-poojas.ts`

All scripts are safe to run multiple times - they only add images if missing!
