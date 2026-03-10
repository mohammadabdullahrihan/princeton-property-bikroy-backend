const request = require("supertest");
const app = require("../server");
const { connectDB, closeDB, clearDB, createTestUsers } = require("./setup");
const Property = require("../models/Property");

let adminToken, viewerToken, adminId, viewerId;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await clearDB();
  const users = await createTestUsers();

  // Get Tokens
  const adminRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.com", password: "password123" });
  adminToken = adminRes.body.data.token;
  adminId = users.admin._id;

  const viewerRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "viewer@test.com", password: "password123" });
  viewerToken = viewerRes.body.data.token;
  viewerId = users.viewer._id;
});

afterAll(async () => {
  await closeDB();
});

describe("Property Endpoints", () => {
  const sampleProperty = {
    title: "Luxury Apartment in Gulshan",
    description:
      "A beautiful luxury apartment in the heart of Gulshan that meets the minimum length requirement of fifty characters or more for validation purposes to pass.",
    price: 5000000,
    category: "buy",
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    size: 1500,
    location: {
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan",
    },
  };

  describe("POST /api/properties", () => {
    it("should create property if admin", async () => {
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(sampleProperty);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe(sampleProperty.title);
      expect(res.body.data.userId).toBeDefined();
    });

    it("should deny create if viewer", async () => {
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${viewerToken}`)
        .send(sampleProperty);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/properties", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(sampleProperty);
    });

    it("should get all properties", async () => {
      // Created property is 'pending' by default; use admin listing endpoint
      const res = await request(app)
        .get("/api/admin/listings")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.pagination.total).toBeGreaterThan(0);
      expect(res.body.data.listings[0].title).toBe(sampleProperty.title);
    });
  });

  describe("PUT /api/properties/:id", () => {
    let propId;
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(sampleProperty);
      propId = res.body.data._id;
    });

    it("should update property if admin", async () => {
      const res = await request(app)
        .put(`/api/properties/${propId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 6000000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.price).toBe(6000000);
    });

    it("should deny update if viewer", async () => {
      const res = await request(app)
        .put(`/api/properties/${propId}`)
        .set("Authorization", `Bearer ${viewerToken}`)
        .send({ price: 6000000 });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("DELETE /api/properties/:id", () => {
    let propId;
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(sampleProperty);
      propId = res.body.data._id;
    });

    it("should delete property if admin", async () => {
      const res = await request(app)
        .delete(`/api/properties/${propId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);

      const check = await Property.findById(propId);
      expect(check).toBeNull();
    });
  });
});
