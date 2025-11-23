import { Request, Response, NextFunction } from 'express';
import { authenticate, requirePermission, optionalAuth } from '../../middleware/auth';
import { createApiKey } from '../../services/apiKey.service';
import { prisma } from '../../lib/database';

// Mock Express objects
const mockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  headers: {},
  query: {},
  ...overrides,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = (): NextFunction => jest.fn();

describe('Auth Middleware', () => {
  let testApiKey: string;

  beforeAll(async () => {
    const key = await createApiKey('Auth Test Key', {
      permissions: ['read', 'write'],
    });
    testApiKey = key.key;
  });

  afterAll(async () => {
    await prisma.apiKey.deleteMany({});
  });

  describe('authenticate', () => {
    it('should authenticate with Bearer token', async () => {
      const req = mockRequest({
        headers: { authorization: `Bearer ${testApiKey}` },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.apiKey).toBeDefined();
    });

    it('should authenticate with X-API-Key header', async () => {
      const req = mockRequest({
        headers: { 'x-api-key': testApiKey },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.apiKey).toBeDefined();
    });

    it('should authenticate with query parameter', async () => {
      const req = mockRequest({
        query: { api_key: testApiKey },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.apiKey).toBeDefined();
    });

    it('should reject request without API key', async () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid API key', async () => {
      const req = mockRequest({
        headers: { authorization: 'Bearer invalid_key' },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requirePermission', () => {
    it('should allow request with required permission', () => {
      const req = mockRequest() as Request;
      req.apiKey = {
        id: 'test',
        key: '***',
        name: 'Test',
        permissions: ['read', 'write'],
        rateLimit: 100,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null,
      };
      const res = mockResponse() as Response;
      const next = mockNext();

      requirePermission('read')(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject request without required permission', () => {
      const req = mockRequest() as Request;
      req.apiKey = {
        id: 'test',
        key: '***',
        name: 'Test',
        permissions: ['read'],
        rateLimit: 100,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null,
      };
      const res = mockResponse() as Response;
      const next = mockNext();

      requirePermission('admin')(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should proceed without API key', async () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.apiKey).toBeUndefined();
    });

    it('should attach apiKey if valid', async () => {
      const req = mockRequest({
        headers: { 'x-api-key': testApiKey },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.apiKey).toBeDefined();
    });
  });
});
