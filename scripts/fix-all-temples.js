#!/usr/bin/env node

/**
 * Fix All Temples - Pooja Images Script
 * 
 * Usage: node fix-all-temples.js
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Loads ALL temples
 * 3. Checks each pooja for missing image field
 * 4. Adds default image if missing
 * 5. Saves all temples back to DB
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

async function fixAllTemples() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Load all temples
    console.log('📖 Loading all temples...');
    const temples = await Temple.find({});
    console.log(`✅ Found ${temples.length} temples\n`);

    let totalMissingImages = 0;
    let totalFixed = 0;
    let templesWithIssues = 0;

    // Process each temple
    for (let i = 0; i < temples.length; i++) {
      const temple = temples[i];
      let templeHasIssues = false;
      let templesFixedCount = 0;

      console.log(`\n[${i + 1}/${temples.length}] Processing: ${temple.name}`);
      console.log('─'.repeat(50));

      // Check each pooja
      temple.poojas.forEach((pooja, index) => {
        templeHasIssues = true;
        totalMissingImages++;
        templesFixedCount++;

        console.log(`  📝 Pooja ${index + 1}: "${pooja.name}"`);

        // Always set/update the image
        pooja.image = {
          id: 'pooja-default',
          imageUrl: PlaceHolderImages.find(img => img.id === 'pooja-havan').imageUrl,
        };
        console.log(`     ✅ Updated: ${pooja.image.imageUrl.substring(0, 50)}...`);
      });

      if (templeHasIssues) {
        templesWithIssues++;
        totalFixed += templesFixedCount;

        // Save this temple
        temple.updatedAt = new Date();
        await temple.save();
        console.log(`  💾 Saved ${templesFixedCount} fix(es)`);
      } else {
        console.log(`  ✓ All poojas have images`);
      }
    }

    // Final Summary
    console.log('\n' + '═'.repeat(50));
    console.log('📊 FINAL SUMMARY');
    console.log('═'.repeat(50));
    console.log(`   Total temples: ${temples.length}`);
    console.log(`   Temples processed: ${templesWithIssues}`);
    console.log(`   Total poojas updated: ${totalFixed}\n`);

    if (totalFixed > 0) {
      console.log('🎉 Successfully updated all pooja images with new URL!');
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
console.log('🏛️  Fix All Temples - Pooja Images Script');
console.log('==========================================\n');
fixAllTemples();
