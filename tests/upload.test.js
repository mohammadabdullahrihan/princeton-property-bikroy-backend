const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB, clearDB, createTestUsers } = require('./setup');
const path = require('path');
const fs = require('fs');

let adminToken;

beforeAll(async () => {
  await connectDB();
  // Ensure uploads dir exists
  if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
    fs.mkdirSync(path.join(__dirname, '../uploads'));
  }
});

beforeEach(async () => {
  await clearDB();
  const users = await createTestUsers();
  
  const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'password123' });
  adminToken = adminRes.body.data.token;
});

afterAll(async () => {
  await closeDB();
});

describe('Upload Endpoints', () => {
  
  it('should upload an image file', async () => {
    // Create a dummy buffer
    const buffer = Buffer.from('fake image content');
    
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', buffer, 'test-image.jpg');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toBeDefined();
    expect(res.body.data.url).toMatch(/\/uploads\//);
  });

  it('should fail if no file uploaded', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toBe(400); // Or whatever 400 status for missing file
    expect(res.body.message).toMatch(/No file/i);
  });
});
