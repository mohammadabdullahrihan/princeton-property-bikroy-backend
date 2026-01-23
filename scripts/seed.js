const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');

const Location = require('../models/Location');

// Load env vars
dotenv.config();

// Bangladesh location data
const bangladeshLocations = [
  {
    division: 'Dhaka',
    districts: [
      {
        name: 'Dhaka',
        areas: [
          'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur',
          'Bashundhara', 'Baridhara', 'Motijheel', 'Tejgaon', 'Farmgate',
          'Kawran Bazar', 'Lalmatia', 'Mohakhali', 'Badda', 'Rampura',
          'Khilgaon', 'Malibagh', 'Shantinagar', 'Paltan', 'Jatrabari',
          'Sayedabad', 'Demra', 'Tongi', 'Gazipur', 'Savar', 'Keraniganj'
        ]
      },
      {
        name: 'Gazipur',
        areas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur']
      },
      {
        name: 'Narayanganj',
        areas: ['Narayanganj Sadar', 'Rupganj', 'Sonargaon', 'Bandar', 'Araihazar']
      }
    ]
  },
  {
    division: 'Chittagong',
    districts: [
      {
        name: 'Chittagong',
        areas: [
          'Agrabad', 'Panchlaish', 'Khulshi', 'Halishahar', 'Nasirabad',
          'GEC Circle', 'Chawkbazar', 'Kotwali', 'Pahartali', 'Bayazid',
          'Chandgaon', 'Bakalia', 'Sadarghat', 'Patenga'
        ]
      },
      {
        name: 'Cox\'s Bazar',
        areas: ['Cox\'s Bazar Sadar', 'Teknaf', 'Ramu', 'Ukhia', 'Chakaria']
      }
    ]
  },
  {
    division: 'Rajshahi',
    districts: [
      {
        name: 'Rajshahi',
        areas: ['Rajshahi Sadar', 'Boalia', 'Motihar', 'Shah Makhdum', 'Rajpara']
      }
    ]
  },
  {
    division: 'Khulna',
    districts: [
      {
        name: 'Khulna',
        areas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali']
      }
    ]
  },
  {
    division: 'Sylhet',
    districts: [
      {
        name: 'Sylhet',
        areas: ['Sylhet Sadar', 'Zindabazar', 'Ambarkhana', 'Uposhohor', 'Moglabazar']
      }
    ]
  },
  {
    division: 'Barisal',
    districts: [
      {
        name: 'Barisal',
        areas: ['Barisal Sadar', 'Kotwali', 'Bandor', 'Rupatali', 'Kawnia']
      }
    ]
  },
  {
    division: 'Rangpur',
    districts: [
      {
        name: 'Rangpur',
        areas: ['Rangpur Sadar', 'Tajhat', 'Mahiganj', 'Mithapukur']
      }
    ]
  },
  {
    division: 'Mymensingh',
    districts: [
      {
        name: 'Mymensingh',
        areas: ['Mymensingh Sadar', 'Charpara', 'Kewatkhali', 'Maskanda']
      }
    ]
  }
];

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@bikroy.com',
    password: 'admin123',
    role: 'admin',
    phone: '01711111111',
    verified: true,
    isActive: true
  },
  {
    name: 'Karim Rahman',
    email: 'karim@example.com',
    password: 'password123',
    role: 'viewer', // Changed from seller
    phone: '01712345678',
    verified: true,
    isActive: true
  },
  {
    name: 'Fatima Ahmed',
    email: 'fatima@example.com',
    password: 'password123',
    role: 'viewer', // Changed from seller
    phone: '01723456789',
    verified: true,
    isActive: true
  },
  {
    name: 'Rahim Khan',
    email: 'rahim@example.com',
    password: 'password123',
    role: 'viewer', // Changed from seller
    phone: '01734567890',
    verified: true,
    isActive: true
  },
  {
    name: 'Ayesha Begum',
    email: 'ayesha@example.com',
    password: 'password123',
    role: 'viewer', // Changed from buyer
    phone: '01745678901',
    verified: true,
    isActive: true
  },
  {
    name: 'Hasan Ali',
    email: 'hasan@example.com',
    password: 'password123',
    role: 'viewer', // Changed from buyer
    phone: '01756789012',
    verified: false,
    isActive: true
  }
];

// Sample properties
const getProperties = (userIds) => [
  {
    title: 'Luxurious 3 Bedroom Apartment in Gulshan',
    description: 'Beautiful modern apartment with stunning city views. Features include spacious living room, modern kitchen with appliances, master bedroom with attached bathroom, two additional bedrooms, guest bathroom, balcony, and parking space. Located in the heart of Gulshan with easy access to restaurants, shopping centers, and schools.',
    category: 'rent',
    propertyType: 'apartment',
    price: 45000,
    size: 1800,
    sizeUnit: 'sqft',
    bedrooms: 3,
    bathrooms: 3,
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', caption: 'Bedroom' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Gulshan',
      address: 'Road 45, Gulshan 2'
    },
    amenities: ['WiFi', 'Gas', 'Water', 'Security'],
    features: {
      parking: true,
      elevator: true,
      generator: true,
      security: true,
      balcony: true
    },
    featured: true,
    verified: true,
    status: 'active',
    userId: userIds[1],
    contactInfo: {
      name: 'Karim Rahman',
      phone: '01712345678',
      email: 'karim@example.com'
    },
    floor: '5th Floor',
    totalFloors: 10
  },
  {
    title: 'Modern Office Space in Banani Commercial Area',
    description: 'Prime commercial office space perfect for startups and small businesses. Fully furnished with modern amenities including high-speed internet, conference room, pantry, and 24/7 security. Excellent location with easy access to public transport and major business hubs.',
    category: 'rent',
    propertyType: 'office',
    price: 80000,
    size: 2500,
    sizeUnit: 'sqft',
    bedrooms: 0,
    bathrooms: 2,
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c', caption: 'Office Space' },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2', caption: 'Meeting Room' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Banani',
      address: 'Banani Commercial Area, Road 11'
    },
    amenities: ['High-speed Internet', 'Conference Room', 'Pantry', 'Reception'],
    features: {
      parking: true,
      elevator: true,
      generator: true,
      security: true
    },
    featured: true,
    verified: true,
    status: 'active',
    userId: userIds[1],
    contactInfo: {
      name: 'Karim Rahman',
      phone: '01712345678',
      email: 'karim@example.com'
    },
    floor: '7th Floor',
    totalFloors: 12
  },
  {
    title: 'Beautiful 4 Bedroom House for Sale in Dhanmondi',
    description: 'Spacious family house in prestigious Dhanmondi area. Features 4 large bedrooms, 4 bathrooms, modern kitchen, dining area, living room, rooftop terrace, garden, and garage for 2 cars. Well-maintained property in a quiet neighborhood with excellent schools and hospitals nearby.',
    category: 'buy',
    propertyType: 'house',
    price: 25000000,
    size: 3200,
    sizeUnit: 'sqft',
    bedrooms: 4,
    bathrooms: 4,
    images: [
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', caption: 'Front View' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', caption: 'Living Area' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Dhanmondi',
      address: 'Road 8/A, Dhanmondi'
    },
    amenities: ['Garden', 'Rooftop', 'Garage', 'Modern Kitchen'],
    features: {
      parking: true,
      generator: true,
      security: true,
      garden: true,
      balcony: true
    },
    featured: true,
    verified: true,
    status: 'active',
    userId: userIds[2],
    contactInfo: {
      name: 'Fatima Ahmed',
      phone: '01723456789',
      email: 'fatima@example.com'
    },
    yearBuilt: 2018
  },
  {
    title: 'Commercial Land for Sale in Uttara',
    description: 'Prime commercial land in rapidly developing Uttara sector. Perfect for building shopping complex, office building, or mixed-use development. Clear title, all utilities available, excellent road access. Great investment opportunity in one of Dhaka\'s fastest-growing areas.',
    category: 'buy',
    propertyType: 'land',
    price: 15000000,
    size: 10,
    sizeUnit: 'katha',
    bedrooms: 0,
    bathrooms: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef', caption: 'Land View' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Uttara',
      address: 'Sector 12, Uttara'
    },
    amenities: ['Road Access', 'Utilities Available', 'Clear Title'],
    features: {},
    featured: false,
    verified: true,
    status: 'active',
    userId: userIds[2],
    contactInfo: {
      name: 'Fatima Ahmed',
      phone: '01723456789',
      email: 'fatima@example.com'
    }
  },
  {
    title: 'Cozy 2 Bedroom Apartment in Bashundhara R/A',
    description: 'Affordable and comfortable apartment perfect for small families or couples. Well-designed layout with efficient use of space. Includes 2 bedrooms, 2 bathrooms, kitchen, living area, and balcony. Located in safe and family-friendly Bashundhara Residential Area with parks, schools, and shopping nearby.',
    category: 'rent',
    propertyType: 'apartment',
    price: 28000,
    size: 1200,
    sizeUnit: 'sqft',
    bedrooms: 2,
    bathrooms: 2,
    images: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55', caption: 'Bedroom' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Bashundhara',
      address: 'Block D, Bashundhara R/A'
    },
    amenities: ['Gas', 'Water', 'Security', 'Playground'],
    features: {
      parking: true,
      elevator: true,
      security: true,
      balcony: true
    },
    featured: false,
    verified: true,
    status: 'active',
    userId: userIds[3],
    contactInfo: {
      name: 'Rahim Khan',
      phone: '01734567890',
      email: 'rahim@example.com'
    },
    floor: '3rd Floor',
    totalFloors: 8
  },
  {
    title: 'Retail Shop Space in Mirpur Shopping Complex',
    description: 'Well-located retail shop in busy Mirpur shopping area. High foot traffic, perfect for clothing store, electronics shop, or any retail business. Includes storage space, bathroom, and display windows. Established commercial area with good customer base.',
    category: 'rent',
    propertyType: 'shop',
    price: 35000,
    size: 600,
    sizeUnit: 'sqft',
    bedrooms: 0,
    bathrooms: 1,
    images: [
      { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8', caption: 'Shop Interior' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Mirpur',
      address: 'Mirpur 10, Shopping Complex'
    },
    amenities: ['Storage', 'Display Windows', 'Bathroom'],
    features: {
      security: true
    },
    featured: false,
    verified: true,
    status: 'active',
    userId: userIds[3],
    contactInfo: {
      name: 'Rahim Khan',
      phone: '01734567890',
      email: 'rahim@example.com'
    }
  },
  {
    title: 'Luxury Penthouse in Baridhara DOHS',
    description: 'Exclusive penthouse with panoramic city views. Premium finishes throughout, including marble floors, designer kitchen, spa-like bathrooms. Features include 4 bedrooms, 5 bathrooms, large living and dining areas, private rooftop terrace with garden, gym room, and 2 parking spaces. Ultimate luxury living in Dhaka\'s most prestigious neighborhood.',
    category: 'buy',
    propertyType: 'apartment',
    price: 45000000,
    size: 4500,
    sizeUnit: 'sqft',
    bedrooms: 4,
    bathrooms: 5,
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', caption: 'Penthouse View' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', caption: 'Living Area' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Baridhara',
      address: 'Baridhara DOHS'
    },
    amenities: ['Rooftop Garden', 'Gym', 'Swimming Pool Access', 'Concierge'],
    features: {
      parking: true,
      elevator: true,
      generator: true,
      security: true,
      garden: true,
      gym: true,
      swimmingPool: true,
      balcony: true
    },
    featured: true,
    verified: true,
    status: 'active',
    userId: userIds[2],
    contactInfo: {
      name: 'Fatima Ahmed',
      phone: '01723456789',
      email: 'fatima@example.com'
    },
    floor: 'Penthouse',
    totalFloors: 15,
    yearBuilt: 2020
  },
  {
    title: 'Affordable Studio Apartment in Mohammadpur',
    description: 'Perfect for students or young professionals. Compact and efficient studio layout with bedroom area, kitchenette, and bathroom. Affordable rent in convenient location near universities, markets, and public transport. Safe building with 24/7 security.',
    category: 'rent',
    propertyType: 'apartment',
    price: 12000,
    size: 450,
    sizeUnit: 'sqft',
    bedrooms: 1,
    bathrooms: 1,
    images: [
      { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af', caption: 'Studio Layout' }
    ],
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Mohammadpur',
      address: 'Mohammadpur Housing Estate'
    },
    amenities: ['Gas', 'Water', 'Security'],
    features: {
      security: true
    },
    featured: false,
    verified: true,
    status: 'active',
    userId: userIds[1],
    contactInfo: {
      name: 'Karim Rahman',
      phone: '01712345678',
      email: 'karim@example.com'
    },
    floor: '2nd Floor',
    totalFloors: 5
  }
];

// Sample reviews


// Connect to database and seed
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});

    await Location.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Seed locations
    console.log('\n📍 Seeding locations...');
    await Location.insertMany(bangladeshLocations);
    console.log(`✅ Seeded ${bangladeshLocations.length} divisions with districts and areas`);
    
    // Seed users
    console.log('\n👥 Seeding users...');
    const createdUsers = [];
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
      createdUsers.push(newUser);
    }
    const userIds = createdUsers.map(user => user._id);
    console.log(`✅ Seeded ${createdUsers.length} users`);
    
    // Seed properties
    console.log('\n🏠 Seeding properties...');
    const properties = getProperties(userIds);
    const createdProperties = await Property.insertMany(properties);
    const propertyIds = createdProperties.map(property => property._id);
    console.log(`✅ Seeded ${createdProperties.length} properties`);
    

    

    
    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📝 Sample credentials:');
    console.log('   Admin: admin@bikroy.com / admin123');
    console.log('   Seller: karim@example.com / password123');
    console.log('   Buyer: ayesha@example.com / password123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
