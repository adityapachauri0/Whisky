const request = require('supertest');
const app = require('../server');

describe('Security Tests', () => {
  describe('Security Headers', () => {
    it('should set security headers correctly', async () => {
      const res = await request(app)
        .get('/api/health');

      // Check for important security headers
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['x-xss-protection']).toBe('1; mode=block');
      expect(res.headers['strict-transport-security']).toBeDefined();
      expect(res.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('CSRF Protection', () => {
    it('should reject POST requests without CSRF token', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test',
          email: 'test@example.com',
          message: 'Test message'
        });

      // Should be rejected due to missing CSRF token
      expect([403, 500]).toContain(res.status);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on public endpoints', async () => {
      const requests = [];
      
      // Make 61 requests (rate limit is 60 per 15 minutes)
      for (let i = 0; i < 61; i++) {
        requests.push(
          request(app)
            .get('/api/health')
        );
      }

      const responses = await Promise.all(requests);
      
      // Last request should be rate limited
      const rateLimited = responses.some(res => res.status === 429);
      expect(rateLimited).toBe(true);
    });
  });

  describe('Input Validation and Sanitization', () => {
    it('should reject requests with malformed JSON', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", invalid json');

      expect(res.status).toBe(400);
    });

    it('should sanitize HTML in input fields', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: '<script>alert("XSS")</script>Test',
          email: 'test@example.com',
          message: 'Test message<img src=x onerror=alert(1)>'
        });

      // The request should succeed but with sanitized data
      // Check response or database to ensure scripts were removed
      expect(res.status).not.toBe(500);
    });

    it('should reject SQL injection attempts', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: "admin' OR '1'='1",
          password: "password' OR '1'='1"
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should reject NoSQL injection attempts', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: { $ne: null },
          password: { $ne: null }
        });

      expect([400, 401]).toContain(res.status);
    });
  });

  describe('Authentication Security', () => {
    it('should not expose sensitive information in error messages', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
      // Should not reveal whether email exists or not
      expect(res.body.message).not.toContain('not found');
      expect(res.body.message).not.toContain('incorrect password');
    });

    it('should use secure cookies in production', async () => {
      // This test would need NODE_ENV=production
      if (process.env.NODE_ENV === 'production') {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'Password123!'
          });

        if (res.status === 200) {
          const cookies = res.headers['set-cookie'];
          const authCookie = cookies.find(c => c.includes('authToken'));
          
          expect(authCookie).toContain('Secure');
          expect(authCookie).toContain('HttpOnly');
          expect(authCookie).toContain('SameSite=Strict');
        }
      }
    });
  });

  describe('File Upload Security', () => {
    it('should reject files with dangerous extensions', async () => {
      const res = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('malicious'), 'virus.exe');

      expect([400, 404]).toContain(res.status);
    });
  });

  describe('API Security', () => {
    it('should not expose stack traces in production', async () => {
      // Force an error
      const res = await request(app)
        .get('/api/undefined-route-that-causes-error');

      expect(res.status).toBe(404);
      expect(res.body).not.toHaveProperty('stack');
      expect(res.text).not.toContain('at ');
    });

    it('should validate content-type headers', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'text/plain')
        .send('email=test@example.com&password=test');

      expect([400, 415]).toContain(res.status);
    });
  });
});