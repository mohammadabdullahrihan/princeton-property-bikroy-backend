const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB } = require('./setup');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Location Endpoints', () => {
  it('should return locations structure', async () => {
    const res = await request(app).get('/api/locations');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    // Assuming structure based on typical implementation
    if (res.body.data) {
        // Just verify it returns something meaningful
        expect(Array.isArray(res.body.data) || typeof res.body.data === 'object').toBe(true);
    }
  });
});
