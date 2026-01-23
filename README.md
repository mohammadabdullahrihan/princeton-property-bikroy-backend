# Princeton Property Bikroy - Backend API

Complete production-ready backend for a property marketplace built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality
- ✅ **User Authentication & Authorization** - JWT-based auth with role-based access control
- ✅ **Property Management** - Full CRUD operations with advanced search and filtering
- ✅ **Review System** - Property reviews with rating statistics
- ✅ **Saved Searches** - Save search criteria and get notifications
- ✅ **Property Flagging** - Report inappropriate listings with admin review workflow
- ✅ **Bangladesh Location Data** - Complete divisions, districts, and areas for autocomplete

### Security & Performance
- 🔒 Password hashing with bcrypt
- 🔒 JWT token authentication
- 🔒 MongoDB injection prevention
- 🔒 Rate limiting
- 🔒 CORS configuration
- 🔒 Security headers with Helmet
- ⚡ Indexed database queries
- ⚡ Pagination support

### API Features
- 📝 Standardized JSON responses
- 📝 Comprehensive validation
- 📝 Global error handling
- 📝 Async error handling
- 📝 Request validation with express-validator

## 📋 Prerequisites

- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm >= 6.0.0

## 🛠️ Installation

### 1. Clone and Navigate
```bash
cd princeton-property-bikroy-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/princeton-property-bikroy
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 4. Seed Database
```bash
npm run seed
```

This will populate your database with:
- 6 sample users (1 admin, 3 sellers, 2 buyers)
- 8 sample properties
- 4 sample reviews
- Complete Bangladesh location data (8 divisions with districts and areas)

### 5. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format
All API responses follow this standardized format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "message": "Error message"
}
```

### Authentication Routes

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer",
  "phone": "01712345678"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Property Routes

#### Get All Properties (with filters)
```http
GET /api/properties?category=rent&division=Dhaka&minPrice=10000&maxPrice=50000&bedrooms=3&page=1&limit=12
```

Query Parameters:
- `category` - buy/rent
- `propertyType` - apartment/house/land/commercial/office/shop/warehouse
- `division` - Division name
- `district` - District name
- `area` - Area name (partial match)
- `minPrice`, `maxPrice` - Price range
- `minSize`, `maxSize` - Size range
- `bedrooms` - Minimum bedrooms
- `bathrooms` - Minimum bathrooms
- `featured` - true/false
- `verified` - true/false
- `search` - Text search
- `sort` - Sort field (default: -createdAt)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

#### Get Single Property
```http
GET /api/properties/:id
```

#### Create Property (Seller/Admin only)
```http
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Beautiful 3 Bedroom Apartment",
  "description": "Spacious apartment with modern amenities...",
  "category": "rent",
  "propertyType": "apartment",
  "price": 35000,
  "size": 1500,
  "sizeUnit": "sqft",
  "bedrooms": 3,
  "bathrooms": 2,
  "images": [
    { "url": "https://...", "caption": "Living Room" }
  ],
  "location": {
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Gulshan",
    "address": "Road 45, Gulshan 2"
  },
  "features": {
    "parking": true,
    "elevator": true,
    "security": true
  }
}
```

#### Update Property (Owner/Admin)
```http
PUT /api/properties/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 40000,
  "status": "active"
}
```

#### Delete Property (Owner/Admin)
```http
DELETE /api/properties/:id
Authorization: Bearer {token}
```

#### Get Featured Properties
```http
GET /api/properties/featured?limit=6
```

#### Get Similar Properties
```http
GET /api/properties/:id/similar?limit=4
```

### User Routes

#### Get User Profile
```http
GET /api/users/profile/:id
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "01712345678"
}
```

#### Get Dashboard Analytics
```http
GET /api/users/dashboard
Authorization: Bearer {token}
```

#### Get My Properties
```http
GET /api/users/my-properties?status=active&page=1&limit=10
Authorization: Bearer {token}
```

### Review Routes

#### Get Property Reviews
```http
GET /api/reviews/property/:propertyId?page=1&limit=10
```

#### Create Review
```http
POST /api/reviews/property/:propertyId
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent property! Highly recommended."
}
```

#### Update Review
```http
PUT /api/reviews/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review text"
}
```

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer {token}
```

#### Mark Review as Helpful
```http
PUT /api/reviews/:id/helpful
Authorization: Bearer {token}
```

### Saved Search Routes

#### Get All Saved Searches
```http
GET /api/saved-searches
Authorization: Bearer {token}
```

#### Create Saved Search
```http
POST /api/saved-searches
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "3BR Apartments in Gulshan",
  "searchParams": {
    "category": "rent",
    "propertyType": "apartment",
    "location": {
      "division": "Dhaka",
      "area": "Gulshan"
    },
    "priceRange": {
      "min": 30000,
      "max": 50000
    },
    "bedrooms": {
      "min": 3
    }
  },
  "emailNotifications": true,
  "notificationFrequency": "daily"
}
```

#### Get Matching Properties
```http
GET /api/saved-searches/:id/matches
Authorization: Bearer {token}
```

### Location Routes

#### Get All Divisions
```http
GET /api/locations/divisions
```

#### Get Districts by Division
```http
GET /api/locations/districts/Dhaka
```

#### Get Areas by District
```http
GET /api/locations/areas/Dhaka/Dhaka
```

#### Search Areas
```http
GET /api/locations/search?q=gulshan
```

### Property Flag Routes

#### Flag a Property
```http
POST /api/flags/property/:propertyId
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "spam",
  "description": "This listing appears to be spam"
}
```

#### Get My Flags
```http
GET /api/flags/my-flags
Authorization: Bearer {token}
```

## 🗂️ Project Structure

```
princeton-property-bikroy-backend/
├── config/              # Configuration files
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── propertyController.js
│   ├── reviewController.js
│   ├── savedSearchController.js
│   ├── flagController.js
│   └── locationController.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication & authorization
│   ├── validator.js    # Request validation
│   └── errorHandler.js # Error handling
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Property.js
│   ├── Review.js
│   ├── SavedSearch.js
│   ├── PropertyFlag.js
│   └── Location.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── propertyRoutes.js
│   ├── reviewRoutes.js
│   ├── savedSearchRoutes.js
│   ├── flagRoutes.js
│   └── locationRoutes.js
├── scripts/            # Utility scripts
│   └── seed.js        # Database seeder
├── uploads/           # File uploads directory
├── .env              # Environment variables
├── .env.example      # Environment template
├── .gitignore        # Git ignore rules
├── package.json      # Dependencies
└── server.js         # Application entry point
```

## 👥 User Roles

### Buyer
- Browse and search properties
- View property details
- Save searches
- Write reviews
- Flag inappropriate properties

### Seller
- All buyer permissions
- Create, update, delete own properties
- View dashboard analytics
- Manage own listings

### Admin
- All seller permissions
- Verify properties
- Feature properties
- Review and manage flags
- Manage all users
- Delete any property/review

## 🔐 Sample Credentials

After running `npm run seed`, use these credentials:

**Admin:**
- Email: admin@bikroy.com
- Password: admin123

**Seller:**
- Email: karim@example.com
- Password: password123

**Buyer:**
- Email: ayesha@example.com
- Password: password123

## 🧪 Testing API

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bikroy.com","password":"admin123"}'

# Get properties
curl http://localhost:5000/api/properties?category=rent&limit=5

# Create property (replace TOKEN)
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Property","description":"A test property listing...",...}'
```

### Using Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. For protected routes, add header: `Authorization: Bearer {token}`

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret-key-very-long-and-random
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-domain.com
```

### Deployment Platforms

#### Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

#### Railway
```bash
railway login
railway init
railway add
railway up
```

#### Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy

## 📝 Notes

- All passwords are hashed using bcrypt
- JWT tokens expire in 30 days (configurable)
- Rate limiting: 100 requests per 15 minutes per IP
- Maximum file upload size: 5MB
- Pagination default: 12 items per page
- All dates are stored in UTC

## 🤝 Integration with Frontend

This backend is ready to integrate with your React frontend. Make sure to:

1. Set `VITE_API_URL=http://localhost:5000/api` in frontend `.env`
2. Use the standardized response format in your API calls
3. Store JWT token in localStorage/cookies
4. Include token in Authorization header for protected routes

## 📄 License

MIT

## 👨‍💻 Author

Princeton Property Bikroy Team

---

**Ready for production! 🎉**
