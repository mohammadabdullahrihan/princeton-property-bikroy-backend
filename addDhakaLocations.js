const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('./models/Location');

dotenv.config();

const dhakaAreas = [
  'Adabor', 'Aftab Nagar', 'Agargaon', 'Ashkona', 'Azimpur', 'Badda', 'Banani', 
  'Banasree', 'Banglamotor', 'Baridhara', 'Basabo', 'Bashundhara R/A', 'Cantonment', 
  'Chawkbazar', 'Dakshinkhan', 'Demra', 'Dhanmondi', 'Elephant Road', 'Eskaton', 
  'Farmgate', 'Gabtoli', 'Gandaria', 'Gulshan', 'Hazaribagh', 'Jatrabari', 'Jigatola', 
  'Kafrul', 'Kakrail', 'Kalabagan', 'Kalyanpur', 'Kamrangirchar', 'Khilgaon', 'Khilkhet', 
  'Kotwali', 'Kuril', 'Lalbagh', 'Lalmatia', 'Malibagh', 'Mirpur', 'Mohakhali', 
  'Mohammadpur', 'Motijheel', 'Mugdha', 'Nawabganj', 'New Market', 'Niketan', 'Nikunja', 
  'Pallabi', 'Paltan', 'Panthapath', 'Rampura', 'Sabujbagh', 'Savar', 'Science Lab', 
  'Shahbagh', 'Shajahanpur', 'Shantinagar', 'Shikdar Real Estate', 'Shyamoli', 'Sutrapur', 
  'Tejgaon', 'Tongi', 'Uttara', 'Uttarkhan', 'Wari'
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
        const currentAreas = new Set(dhakaDistrict.areas);
        dhakaAreas.forEach(area => currentAreas.add(area));
        
        dhakaDistrict.areas = Array.from(currentAreas).sort();
        
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
