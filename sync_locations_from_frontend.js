const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Location = require('./models/Location');

dotenv.config();

const bnPath = path.join(__dirname, '../princeton-property-bikroy-frontend/public/locales/bn/translation.json');
const enPath = path.join(__dirname, '../princeton-property-bikroy-frontend/public/locales/en/translation.json');

async function syncLocations() {
  try {
    const bnData = JSON.parse(fs.readFileSync(bnPath, 'utf8'));
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    const areas = [];
    for (const key in bnData) {
      if (key.startsWith('home_loc_')) {
        areas.push({
          name: enData[key] || bnData[key], // Fallback to BN if EN is missing
          name_bn: bnData[key]
        });
      }
    }

    console.log(`Found ${areas.length} areas to sync.`);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let dhakaLocation = await Location.findOne({ division: 'Dhaka' });
    
    if (!dhakaLocation) {
      dhakaLocation = new Location({
        division: 'Dhaka',
        division_bn: 'ঢাকা',
        districts: []
      });
    }

    let dhakaDistrict = dhakaLocation.districts.find(d => d.name === 'Dhaka');
    if (!dhakaDistrict) {
      dhakaDistrict = { name: 'Dhaka', name_bn: 'ঢাকা', areas: [] };
      dhakaLocation.districts.push(dhakaDistrict);
    }

    // Merge and deduplicate based on Bengali name
    const existingAreasMap = new Map();
    dhakaDistrict.areas.forEach(a => {
      existingAreasMap.set(a.name_bn, a);
    });

    areas.forEach(newArea => {
      existingAreasMap.set(newArea.name_bn, newArea);
    });

    dhakaDistrict.areas = Array.from(existingAreasMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    await dhakaLocation.save();
    console.log('✅ Successfully synced Dhaka areas from frontend to backend DB.');

  } catch (err) {
    console.error('❌ Error syncing locations:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

syncLocations();
