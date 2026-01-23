const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');

const dotenv = require('dotenv');

dotenv.config();

const mainUri = process.env.MONGO_URI || 'mongodb://localhost:27017/princeton-property-bikroy';
let mongoUri = process.env.MONGO_URI_TEST;

if (!mongoUri) {
  // Replace database name with test database name
  if (mainUri.includes('?')) {
    mongoUri = mainUri.replace(/\/[^/?]+\?/, '/princeton-property-bikroy-test?');
  } else {
    mongoUri = mainUri + '-test';
  }
}

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Quiet logs for tests
    } catch (err) {
        console.error('Test DB Connection Error:', err);
        process.exit(1);
    }
};

const closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

const clearDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
};

const createTestUsers = async () => {
    const admin = await User.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        verified: true
    });

    const viewer = await User.create({
        name: 'Test Viewer',
        email: 'viewer@test.com',
        password: 'password123',
        role: 'viewer',
        verified: true
    });

    return { admin, viewer };
};

module.exports = {
    connectDB,
    closeDB,
    clearDB,
    createTestUsers
};
