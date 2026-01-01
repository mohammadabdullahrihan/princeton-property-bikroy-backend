const mongoose = require("mongoose")
const User = require("../models/User")
const Property = require("../models/Property")
const Location = require("../models/Location")
const BuildingProduct = require("../models/BuildingProduct")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/property-bikroy")
    console.log("MongoDB connected")
  } catch (err) {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  }
}

const seedDatabase = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Property.deleteMany({})
    await Location.deleteMany({})
    await BuildingProduct.deleteMany({})

    // Create locations (Bangladesh divisions, districts, areas)
    const locations = [
      // Dhaka
      { division: "ঢাকা", district: "ঢাকা", area: "মিরপুর" },
      { division: "ঢাকা", district: "ঢাকা", area: "উত্তরা" },
      { division: "ঢাকা", district: "ঢাকা", area: "ধানমন্ডি" },
      { division: "ঢাকা", district: "ঢাকা", area: "গুলশান" },
      { division: "ঢাকা", district: "ঢাকা", area: "বারিধারা" },
      { division: "ঢাকা", district: "ঢাকা", area: "বসুন্ধরা" },
      // Chittagong
      { division: "চট্টগ্রাম", district: "চট্টগ্রাম", area: "কোয়ার্টার গার্ডেন" },
      { division: "চট্টগ্রাম", district: "চট্টগ্রাম", area: "হালিশহর" },
      // Sylhet
      { division: "সিলেট", district: "সিলেট", area: "জিন্দাবাজার" },
      // Khulna
      { division: "খুলনা", district: "খুলনা", area: "শহরের কেন্দ্র" },
      // Barisal
      { division: "বরিশাল", district: "বরিশাল", area: "শহরের কেন্দ্র" },
      // Rajshahi
      { division: "রাজশাহী", district: "রাজশাহী", area: "নতুন শহর" },
      // Rangpur
      { division: "রংপুর", district: "রংপুর", area: "শহরের কেন্দ্র" },
      // Mymensingh
      { division: "ময়মনসিংহ", district: "ময়মনসিংহ", area: "শহরের কেন্দ্র" },
    ]

    await Location.insertMany(locations)
    console.log("Locations seeded")

    // Create users
    const users = [
      {
        name: "রহিম বাই সেলার",
        email: "rahim@example.com",
        password: "password123",
        phone: "01712345678",
        role: "user",
        verified: true,
      },
      {
        name: "এজেন্ট করিম",
        email: "karim@example.com",
        password: "password123",
        phone: "01812345678",
        role: "agent",
        verified: true,
      },
      {
        name: "অ্যাডমিন আলী",
        email: "admin@example.com",
        password: "password123",
        phone: "01912345678",
        role: "admin",
        verified: true,
      },
    ]

    const createdUsers = await User.insertMany(users)
    console.log("Users seeded")

    // Create sample properties
    const properties = [
      {
        userId: createdUsers[0]._id,
        title: "সুন্দর ৩ BHK ফ্ল্যাট মিরপুরে",
        description: "আধুনিক সুবিধা সহ সুন্দর ৩ বেডরুম ফ্ল্যাট",
        category: "buy",
        type: "flat",
        location: {
          division: "ঢাকা",
          district: "ঢাকা",
          area: "মিরপুর",
        },
        price: 5500000,
        bedrooms: 3,
        size: 1200,
        featured: true,
      },
      {
        userId: createdUsers[1]._id,
        title: "উত্তরায় ভাড়া দিতে চাই ২ BHK অ্যাপার্টমেন্ট",
        description: "প্রাইভেট গেটেড সম্প্রদায়ে অবস্থিত",
        category: "rent",
        type: "flat",
        location: {
          division: "ঢাকা",
          district: "ঢাকা",
          area: "উত্তরা",
        },
        price: 35000,
        bedrooms: 2,
        size: 900,
        featured: true,
      },
      {
        userId: createdUsers[0]._id,
        title: "ধানমন্ডিতে বাণিজ্যিক স্থান বিক্রয়",
        description: "শপিং মল কাছে অবস্থিত",
        category: "buy",
        type: "commercial",
        location: {
          division: "ঢাকা",
          district: "ঢাকা",
          area: "ধানমন্ডি",
        },
        price: 12000000,
        size: 5000,
        featured: true,
      },
    ]

    await Property.insertMany(properties)
    console.log("Properties seeded")

    // Create sample building products
    const products = [
      {
        userId: createdUsers[0]._id,
        name: "মানসম্পন্ন ইট",
        description: "নির্ভরযোগ্য সরবরাহকারীর কাছ থেকে সেরা মানের ইট",
        price: 12000,
        category: "bricks",
      },
      {
        userId: createdUsers[1]._id,
        name: "সিমেন্ট ব্যাগ",
        description: "শক্তিশালী এবং টেকসই সিমেন্ট",
        price: 450,
        category: "cement",
      },
    ]

    await BuildingProduct.insertMany(products)
    console.log("Building products seeded")

    console.log("Database seeding completed successfully")
    process.exit(0)
  } catch (err) {
    console.error("Seeding error:", err)
    process.exit(1)
  }
}

seedDatabase()
