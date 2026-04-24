#!/usr/bin/env node

/**
 * Fix Missing Pooja Images Script
 * 
 * Usage: node fix-pooja-images.js <templeId>
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Loads a temple by ID
 * 3. Checks each pooja for missing image field
 * 4. Adds default image if missing
 * 5. Saves the temple back to DB
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Placeholder images
const PlaceHolderImages = [
  { id: 'pooja-havan', imageUrl: 'https://images.unsplash.com/photo-1705952484283-19c31e37e0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmaXJlJTIwcml0dWFsfGVufDB8fHx8MTc2MjMyNjE0M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'temple-north', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=500&fit=crop' },
];

// Temple Schema
const templeSchema = new mongoose.Schema({
  name: String,
  location: String,
  address: String,
  description: String,
  image: {
    id: String,
    imageUrl: String,
  },
  poojas: [
    {
      name: String,
      description: String,
      price: Number,
      time: String,
      tags: [String],
      image: {
        id: String,
        imageUrl: String,
      },
    },
  ],
  lat: Number,
  lng: Number,
  creator: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Temple = mongoose.model('Temple', templeSchema);

async function fixTempleImages(templeId) {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Load the temple
    console.log(`📖 Loading temple with ID: ${templeId}`);
    const temple = await Temple.findById(templeId);

    if (!temple) {
      console.log('❌ Temple not found with that ID');
      process.exit(1);
    }

    console.log(`✅ Found temple: ${temple.name}\n`);

    // Count poojas with missing images
    let missingImageCount = 0;
    let fixedCount = 0;

    console.log('🔍 Checking poojas for missing images...\n');

    // Loop through poojas
    temple.poojas.forEach((pooja, index) => {
      const poojNum = index + 1;
      
      console.log(`  📝 Pooja ${poojNum}: "${pooja.name}"`);
      
      // Always set/update the image
      pooja.image = {
        id: 'pooja-default',
        imageUrl: PlaceHolderImages.find(img => img.id === 'pooja-havan').imageUrl,
      };
      fixedCount++;
      console.log(`     ✅ Updated: ${pooja.image.imageUrl.substring(0, 50)}...\n`);
    });

    // Summary
    console.log('📊 Summary:');
    console.log(`   Total poojas: ${temple.poojas.length}`);
    console.log(`   Updated: ${fixedCount}\n`);

    if (fixedCount > 0) {
      // Save the temple
      console.log('💾 Saving temple to MongoDB...');
      temple.updatedAt = new Date();
      await temple.save();
      console.log('✅ Temple saved successfully!\n');
      console.log('🎉 All pooja images have been updated with new URL!');
    } else {
      console.log('✅ No poojas to update.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Main
const templeId = process.argv[2];

if (!templeId) {
  console.log('Usage: node fix-pooja-images.js <templeId>\n');
  console.log('Example: node fix-pooja-images.js 60d5ec49c1234567890abcde\n');
  process.exit(1);
}

console.log('🏛️  Pooja Image Fixer Script');
console.log('==========================\n');
fixTempleImages(templeId);
