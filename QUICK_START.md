# 🚀 Quick Start Guide - Princeton Property Bikroy Backend

## ✅ Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - Check: `node --version`
- ✅ npm (v6 or higher) - Check: `npm --version`
- ✅ MongoDB connection (local or Atlas)

## 📦 Step 1: Installation

Dependencies are already installed! If you need to reinstall:

```bash
cd princeton-property-bikroy-backend
npm install
```

## 🗄️ Step 2: Database Setup

### Option A: Using MongoDB Atlas (Recommended - Already Configured!)

Your `.env` file is already configured with MongoDB Atlas. The database will be created automatically when you run the seed script.

### Option B: Using Local MongoDB

If you prefer local MongoDB, update `.env`:

```env
MONGO_URI=mongodb://localhost:27017/princeton-property-bikroy
```

## 🌱 Step 3: Seed Database with Demo Data

Run the seed script to populate your database:

```bash
npm run seed
```

This will create:
- ✅ **6 Users** (1 Admin, 3 Sellers, 2 Buyers)
- ✅ **8 Properties** (Various types: apartments, houses, offices, etc.)
- ✅ **4 Reviews** (Sample property reviews)
- ✅ **Bangladesh Locations** (8 divisions with districts and areas)

### Sample Credentials Created:

**Admin Account:**
- Email: `admin@bikroy.com`
- Password: `admin123`

**Seller Account:**
- Email: `karim@example.com`
- Password: `password123`

**Buyer Account:**
- Email: `ayesha@example.com`
- Password: `password123`

## 🎯 Step 4: Start the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: cluster.mongodb.net
📊 Database: princeton-property-bikroy
🚀 Server running in development mode
🌐 Server URL: http://localhost:5000
📡 API Base URL: http://localhost:5000/api
✨ Princeton Property Bikroy Backend is ready!
```

## 🧪 Step 5: Test the API

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-23T...",
    "uptime": 5.123,
    "environment": "development"
  },
  "message": "Server is running"
}
```

### Test 2: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bikroy.com",
    "password": "admin123"
  }'
```

Save the token from the response!

### Test 3: Get Properties
```bash
curl http://localhost:5000/api/properties?limit=5
```

### Test 4: Get Locations
```bash
curl http://localhost:5000/api/locations/divisions
```

## 🔗 Step 6: Connect with Frontend

1. Make sure your frontend `.env` has:
```env
VITE_API_URL=http://localhost:5000/api
```

2. Start your frontend:
```bash
cd ../princeton-property-bikroy-frontend
npm run dev
```

3. Your frontend should now be able to:
   - Login with the sample credentials
   - Browse properties
   - Search and filter
   - Create new properties (as seller)
   - Leave reviews
   - And more!

## 📚 Common API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires token)

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (seller/admin)
- `PUT /api/properties/:id` - Update property (owner/admin)
- `DELETE /api/properties/:id` - Delete property (owner/admin)

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update own profile
- `GET /api/users/dashboard` - Get dashboard analytics

### Reviews
- `GET /api/reviews/property/:propertyId` - Get property reviews
- `POST /api/reviews/property/:propertyId` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Locations
- `GET /api/locations/divisions` - Get all divisions
- `GET /api/locations/districts/:division` - Get districts
- `GET /api/locations/areas/:division/:district` - Get areas
- `GET /api/locations/search?q=gulshan` - Search areas

## 🔐 Using Protected Routes

For routes that require authentication, include the JWT token in the header:

```bash
curl -X GET http://localhost:5000/api/users/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🛠️ Troubleshooting

### Issue: "MongoDB connection error"
**Solution:** Check your `MONGO_URI` in `.env` file. Make sure MongoDB is running (if local) or your Atlas credentials are correct.

### Issue: "Port 5000 already in use"
**Solution:** Change the `PORT` in `.env` to another port (e.g., 5001) or kill the process using port 5000:
```bash
lsof -ti:5000 | xargs kill -9
```

### Issue: "JWT token invalid"
**Solution:** Make sure you're including the token in the Authorization header as `Bearer {token}`

### Issue: "Validation errors"
**Solution:** Check the API documentation for required fields. All validation errors will be returned with field names and messages.

## 📊 Database Management

### View Database
If using MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select `princeton-property-bikroy` database

### Reset Database
To clear and reseed the database:
```bash
npm run seed
```

This will delete all existing data and create fresh demo data.

## 🎨 Customization

### Add More Sample Data
Edit `scripts/seed.js` to add more:
- Users
- Properties
- Reviews
- Locations

### Modify Models
All models are in the `models/` directory:
- `User.js` - User schema
- `Property.js` - Property schema
- `Review.js` - Review schema
- `SavedSearch.js` - Saved search schema
- `PropertyFlag.js` - Property flag schema
- `Location.js` - Location schema

### Add New Routes
1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Import and use in `server.js`

## 📖 Full Documentation

For complete API documentation, see `README.md`

## 🎉 You're All Set!

Your backend is now running and ready to handle requests from your frontend!

**Next Steps:**
1. ✅ Test all API endpoints
2. ✅ Integrate with your frontend
3. ✅ Customize as needed
4. ✅ Deploy to production

---

**Need Help?** Check the main README.md for detailed documentation.

**Happy Coding! 🚀**
