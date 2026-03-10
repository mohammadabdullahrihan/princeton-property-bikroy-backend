const request = require("supertest");
const app = require("../server");
const { connectDB, closeDB, clearDB, createTestUsers } = require("./setup");
const User = require("../models/User");

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe("Auth Endpoints", () => {
  describe("POST /api/auth/signup", () => {
    it("should register a new user with valid data", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        name: "New User",
        email: "new@test.com",
        password: "password123",
        phone: "01711223344",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it("should not register with existing email", async () => {
      await User.create({
        name: "Existing",
        email: "existing@test.com",
        password: "password123",
        role: "viewer",
      });

      const res = await request(app)
        .post("/api/auth/signup") // Note: route is usually signup or register, confirmed signup in controller code
        .send({
          name: "New User",
          email: "existing@test.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/exists/i);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      // Create user directly
      await User.create({
        name: "Login User",
        email: "login@test.com",
        password: "password123",
        role: "viewer",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "login@test.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it("should fail with invalid password", async () => {
      await User.create({
        name: "Login User",
        email: "login@test.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "login@test.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Protected Routes Access", () => {
    let adminToken, viewerToken;

    beforeEach(async () => {
      const users = await createTestUsers();

      const adminLogin = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@test.com", password: "password123" });
      adminToken = adminLogin.body.data.token;

      const viewerLogin = await request(app)
        .post("/api/auth/login")
        .send({ email: "viewer@test.com", password: "password123" });
      viewerToken = viewerLogin.body.data.token;
    });

    it("should allow viewer to access non-admin protected routes", async () => {
      // NOTE: /api/properties is generally public GET, but POST is protected
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${viewerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.role).toBe("viewer");
    });

    it("should forgot password flow work", async () => {
      const user = await User.create({
        name: "Forgot",
        email: "forgot@test.com",
        password: "password123",
      });

      // Request Reset
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "forgot@test.com" });

      expect(res.statusCode).toBe(200);
      // Email may not be sent in test env if no SMTP, but resetToken should be stored

      // Check token in DB
      const updatedUser = await User.findOne({
        email: "forgot@test.com",
      }).select("+resetPasswordToken");
      expect(updatedUser.resetPasswordToken).toBeDefined();

      // Actually verify we cannot reset without valid token (mock flow ends here usually unless we extract token from DB)
    });
  });
});
