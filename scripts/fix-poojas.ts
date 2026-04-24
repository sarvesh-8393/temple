import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Placeholder images
const PlaceHolderImages = [
  { id: 'pooja-havan', imageUrl: 'https://images.unsplash.com/photo-1705952484283-19c31e37e0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmaXJlJTIwcml0dWFsfGVufDB8fHx8MTc2MjMyNjE0M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'temple-north', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=500&fit=crop' },
];

interface PoojaImage {
  id: string;
  imageUrl: string;
}

interface Pooja {
  name: string;
  description: string;
  price: number;
  time: string;
  tags?: string[];
  image?: PoojaImage;
}

interface Temple {
  _id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  image?: { id: string; imageUrl: string };
  poojas: Pooja[];
  lat: number;
  lng: number;
  creator?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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

const Temple = mongoose.model<Temple>('Temple', templeSchema);

async function fixTempleImages(templeId: string): Promise<void> {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log('✅ Connected to MongoDB\n');

    console.log(`📖 Loading temple with ID: ${templeId}`);
    const temple = await Temple.findById(templeId);

    if (!temple) {
      console.log('❌ Temple not found with that ID');
      process.exit(1);
    }

    console.log(`✅ Found temple: ${temple.name}\n`);

    let missingImageCount = 0;
    let fixedCount = 0;

    console.log('🔍 Checking poojas for missing images...\n');

    temple.poojas.forEach((pooja, index) => {
      const poojaNum = index + 1;

      console.log(`  📝 Pooja ${poojaNum}: "${pooja.name}"`);

      pooja.image = {
        id: 'pooja-default',
        imageUrl: PlaceHolderImages.find(img => img.id === 'pooja-havan')!.imageUrl,
      };
      fixedCount++;
      console.log(`     ✅ Updated: ${pooja.image.imageUrl.substring(0, 50)}...\n`);
    });

    console.log('📊 Summary:');
    console.log(`   Total poojas: ${temple.poojas.length}`);
    console.log(`   Updated: ${fixedCount}\n`);

    if (fixedCount > 0) {
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
    console.error('❌ Error:', (error as any).message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

async function fixAllTemples(): Promise<void> {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log('✅ Connected to MongoDB\n');

    console.log('📖 Loading all temples...');
    const temples = await Temple.find({});
    console.log(`✅ Found ${temples.length} temples\n`);

    let totalMissingImages = 0;
    let totalFixed = 0;
    let templesWithIssues = 0;

    for (let i = 0; i < temples.length; i++) {
      const temple = temples[i];
      let templeHasIssues = false;
      let templesFixedCount = 0;

      console.log(`\n[${i + 1}/${temples.length}] Processing: ${temple.name}`);
      console.log('─'.repeat(50));

      temple.poojas.forEach((pooja, index) => {
        templeHasIssues = true;
        totalMissingImages++;
        templesFixedCount++;

        console.log(`  📝 Pooja ${index + 1}: "${pooja.name}"`);

        pooja.image = {
          id: 'pooja-default',
          imageUrl: PlaceHolderImages.find(img => img.id === 'pooja-havan')!.imageUrl,
        };
        console.log(`     ✅ Updated: ${pooja.image.imageUrl.substring(0, 50)}...`);
      });

      if (templeHasIssues) {
        templesWithIssues++;
        totalFixed += templesFixedCount;

        temple.updatedAt = new Date();
        await temple.save();
        console.log(`  💾 Saved ${templesFixedCount} fix(es)`);
      } else {
        console.log(`  ✓ All poojas have images`);
      }
    }

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
    console.error('❌ Error:', (error as any).message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Main
const command = process.argv[2];
const templeId = process.argv[3];

console.log('🏛️  Pooja Image Fixer Script');
console.log('==========================\n');

if (command === 'fix-one' && templeId) {
  fixTempleImages(templeId);
} else if (command === 'fix-all') {
  fixAllTemples();
} else {
  console.log('Usage:');
  console.log('  npm run fix-poojas:one <templeId>  - Fix a single temple');
  console.log('  npm run fix-poojas:all             - Fix all temples\n');
  console.log('Examples:');
  console.log('  npm run fix-poojas:one 60d5ec49c1234567890abcde');
  console.log('  npm run fix-poojas:all\n');
  process.exit(1);
}
