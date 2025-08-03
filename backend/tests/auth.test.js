const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Admin = require('../models/Admin');

describe('Authentication Tests', () => {
  let testUser;
  let adminUser;
  let authToken;
  let adminToken;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  beforeEach(async () => {
    // Clear test data
    await User.deleteMany({});
    await Admin.deleteMany({});
    
    // Create test admin
    adminUser = await Admin.create({
      email: 'admin@test.com',
      password: 'Admin123!@#',
      isActive: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
          phone: '+447123456789'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Registration successful');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!',
          phone: '+447123456789'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak',
          phone: '+447123456789'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Password');
    });

    it('should reject duplicate email registration', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: 'test@example.com',
          password: 'Password123!',
          phone: '+447123456789'
        });

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'test@example.com',
          password: 'Password123!',
          phone: '+447987654321'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '+447123456789',
        isVerified: true
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.headers['set-cookie']).toBeDefined();
      
      // Extract auth token from cookies
      const cookies = res.headers['set-cookie'];
      expect(cookies.some(cookie => cookie.includes('authToken'))).toBe(true);
    });

    it('should reject login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should enforce rate limiting on failed login attempts', async () => {
      // Make multiple failed login attempts
      for (let i = 0; i < 4; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'WrongPassword'
          });
      }

      // The 4th attempt should be rate limited
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(429);
    });
  });

  describe('Admin Authentication', () => {
    it('should login admin with valid credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'admin@test.com',
          password: 'Admin123!@#'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.admin).toHaveProperty('email', 'admin@test.com');
      expect(res.headers['set-cookie']).toBeDefined();
      
      // Extract admin token
      const cookies = res.headers['set-cookie'];
      const tokenCookie = cookies.find(cookie => cookie.includes('adminToken'));
      expect(tokenCookie).toBeDefined();
    });

    it('should reject admin login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'admin@test.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Protected Routes', () => {
    beforeEach(async () => {
      // Login to get auth token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      // Extract token from cookie
      const cookies = loginRes.headers['set-cookie'];
      authToken = cookies.find(cookie => cookie.includes('authToken'));
    });

    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Cookie', authToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject access without token', async () => {
      const res = await request(app)
        .get('/api/auth/verify');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('No token provided');
    });
  });

  describe('Logout', () => {
    beforeEach(async () => {
      // Login to get auth token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      authToken = loginRes.headers['set-cookie'].find(cookie => cookie.includes('authToken'));
    });

    it('should successfully logout', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', authToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out successfully');
      
      // Check that cookie is cleared
      const cookies = res.headers['set-cookie'];
      expect(cookies.some(cookie => 
        cookie.includes('authToken') && cookie.includes('Max-Age=0')
      )).toBe(true);
    });
  });

  describe('Security Features', () => {
    it('should sanitize input to prevent XSS', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: '<script>alert("XSS")</script>',
          email: 'xss@test.com',
          password: 'Password123!',
          phone: '+447123456789'
        });

      expect(res.status).toBe(201);
      
      // Check that the name was sanitized
      const user = await User.findOne({ email: 'xss@test.com' });
      expect(user.name).not.toContain('<script>');
      expect(user.name).not.toContain('</script>');
    });

    it('should prevent MongoDB injection', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: { $gt: '' },
          password: { $gt: '' }
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});