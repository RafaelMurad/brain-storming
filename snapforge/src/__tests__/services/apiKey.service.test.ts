import {
  createApiKey,
  validateApiKey,
  getApiKeyById,
  listApiKeys,
  updateApiKey,
  revokeApiKey,
  deleteApiKey,
  hashApiKey,
} from '../../services/apiKey.service';
import { prisma } from '../../lib/database';

describe('ApiKey Service', () => {
  let testKeyId: string;
  let testRawKey: string;

  beforeEach(async () => {
    // Clean up test data
    await prisma.apiKey.deleteMany({});
  });

  afterAll(async () => {
    await prisma.apiKey.deleteMany({});
  });

  describe('createApiKey', () => {
    it('should create a new API key with default permissions', async () => {
      const result = await createApiKey('Test Key');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.key).toMatch(/^sf_/);
      expect(result.name).toBe('Test Key');
      expect(result.permissions).toEqual(['read', 'write']);
      expect(result.isActive).toBe(true);
    });

    it('should create API key with custom permissions', async () => {
      const result = await createApiKey('Admin Key', {
        permissions: ['read', 'write', 'admin'],
        rateLimit: 500,
      });

      expect(result.permissions).toEqual(['read', 'write', 'admin']);
      expect(result.rateLimit).toBe(500);
    });

    it('should create API key with expiration', async () => {
      const result = await createApiKey('Expiring Key', {
        expiresInDays: 30,
      });

      expect(result.expiresAt).toBeDefined();
      const expiresAt = new Date(result.expiresAt!);
      const now = new Date();
      const daysDiff = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBe(30);
    });
  });

  describe('validateApiKey', () => {
    beforeEach(async () => {
      const key = await createApiKey('Validation Test Key');
      testKeyId = key.id;
      testRawKey = key.key;
    });

    it('should validate a correct API key', async () => {
      const result = await validateApiKey(testRawKey);

      expect(result.valid).toBe(true);
      expect(result.apiKey).toBeDefined();
      expect(result.apiKey?.id).toBe(testKeyId);
    });

    it('should reject invalid API key', async () => {
      const result = await validateApiKey('invalid_key');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid API key');
    });

    it('should reject inactive API key', async () => {
      await revokeApiKey(testKeyId);
      const result = await validateApiKey(testRawKey);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('API key is inactive');
    });
  });

  describe('getApiKeyById', () => {
    it('should retrieve API key by ID', async () => {
      const created = await createApiKey('Get Test Key');
      const result = await getApiKeyById(created.id);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Get Test Key');
      expect(result?.key).toBe('***hidden***');
    });

    it('should return null for non-existent key', async () => {
      const result = await getApiKeyById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('listApiKeys', () => {
    it('should list all API keys', async () => {
      await createApiKey('Key 1');
      await createApiKey('Key 2');
      await createApiKey('Key 3');

      const result = await listApiKeys();

      expect(result.length).toBe(3);
      expect(result.every(k => k.key === '***hidden***')).toBe(true);
    });
  });

  describe('updateApiKey', () => {
    it('should update API key properties', async () => {
      const created = await createApiKey('Update Test');
      const result = await updateApiKey(created.id, {
        name: 'Updated Name',
        rateLimit: 200,
      });

      expect(result.name).toBe('Updated Name');
      expect(result.rateLimit).toBe(200);
    });
  });

  describe('deleteApiKey', () => {
    it('should delete API key', async () => {
      const created = await createApiKey('Delete Test');
      await deleteApiKey(created.id);

      const result = await getApiKeyById(created.id);
      expect(result).toBeNull();
    });
  });

  describe('hashApiKey', () => {
    it('should produce consistent hashes', () => {
      const hash1 = hashApiKey('test-key');
      const hash2 = hashApiKey('test-key');

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different keys', () => {
      const hash1 = hashApiKey('key-1');
      const hash2 = hashApiKey('key-2');

      expect(hash1).not.toBe(hash2);
    });
  });
});
