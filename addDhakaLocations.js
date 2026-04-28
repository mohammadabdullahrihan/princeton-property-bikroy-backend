const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('./models/Location');

dotenv.config();

const dhakaAreas = [
  'Adabor', 'Aftab Nagar', 'Agargaon', 'Al-Amin Road', 'Ashkona', 'Azimpur', 'Badda', 'Banani', 
  'Banasree', 'Banglamotor', 'Baridhara', 'Basabo', 'Bashundhara R/A', 'Cantonment', 
  'Central Road', 'Chawkbazar', 'Dakshinkhan', 'Demra', 'Dhanmondi', 'Elephant Road', 'Eskaton', 
  'Farmgate', 'Gabtoli', 'Gandaria', 'Green Road', 'Gulshan', 'Hazaribagh', 'Jatrabari', 'Jigatola', 
  'Kafrul', 'Kakrail', 'Kalabagan', 'Kalabagan Main Road', 'Kalyanpur', 'Kamrangirchar', 'Khilgaon', 'Khilkhet', 
  'Kotwali', 'Kuril', 'Lake Circus Road', 'Lalbagh', 'Lalmatia', 'Malibagh', 'Mirpur', 'Mohakhali', 
  'Mohammadpur', 'Motijheel', 'Mugdha', 'Nawabganj', 'New Market', 'Niketan', 'Nikunja', 
  'North Road', 'Pallabi', 'Paltan', 'Panthapath', 'Rampura', 'Sabujbagh', 'Savar', 'Science Lab', 
  'Shahbagh', 'Shajahanpur', 'Shantinagar', 'Shikdar Real Estate', 'Shukrabad Road', 'Shyamoli', 
  'Sobhanbag Road', 'South Road', 'Sutrapur', 'Tejgaon', 'Tongi', 'Uttara', 'Uttarkhan', 'Wari'
];

async function updateLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const dhakaLocation = await Location.findOne({ division: 'Dhaka' });
    if (dhakaLocation) {
        let dhakaDistrict = dhakaLocation.districts.find(d => d.name === 'Dhaka');
        if (!dhakaDistrict) {
            dhakaDistrict = { name: 'Dhaka', areas: [] };
            dhakaLocation.districts.push(dhakaDistrict);
        }
        
        // Merge and deduplicate
        const existingAreasMap = new Map();
        dhakaDistrict.areas.forEach(a => existingAreasMap.set(a.name, a));

        dhakaAreas.forEach(areaName => {
            if (!existingAreasMap.has(areaName)) {
                existingAreasMap.set(areaName, { name: areaName, name_bn: areaName }); // Fallback BN to EN
            }
        });
        
        dhakaDistrict.areas = Array.from(existingAreasMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        
        await dhakaLocation.save();
        console.log('Successfully updated Dhaka locations.');
    } else {
        console.log('Dhaka division not found in DB.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

updateLocations();
