import {
  isFeatureEnabled,
  isFeatureEnabledSync,
  getAllFeatureFlags,
  setFeatureFlag,
  Feature,
} from '../../lib/featureFlags';
import { prisma } from '../../lib/database';

describe('Feature Flags', () => {
  beforeEach(async () => {
    await prisma.featureFlag.deleteMany({});
  });

  afterAll(async () => {
    await prisma.featureFlag.deleteMany({});
  });

  describe('isFeatureEnabled', () => {
    it('should return default value for unconfigured feature', async () => {
      // PDF export is enabled by default from env
      const result = await isFeatureEnabled(Feature.PDF_EXPORT);
      expect(typeof result).toBe('boolean');
    });

    it('should return database value after setting', async () => {
      await setFeatureFlag('testFeature', true);
      const result = await isFeatureEnabled('testFeature');
      expect(result).toBe(true);

      await setFeatureFlag('testFeature', false);
      const result2 = await isFeatureEnabled('testFeature');
      expect(result2).toBe(false);
    });
  });

  describe('isFeatureEnabledSync', () => {
    it('should return cached value', () => {
      const result = isFeatureEnabledSync(Feature.PDF_EXPORT);
      expect(typeof result).toBe('boolean');
    });

    it('should return false for unknown feature', () => {
      const result = isFeatureEnabledSync('unknownFeature');
      expect(result).toBe(false);
    });
  });

  describe('getAllFeatureFlags', () => {
    it('should return all flags as object', async () => {
      const flags = await getAllFeatureFlags();

      expect(typeof flags).toBe('object');
      expect(flags).toHaveProperty('pdfExport');
      expect(flags).toHaveProperty('fullPageCapture');
    });
  });

  describe('setFeatureFlag', () => {
    it('should create new flag in database', async () => {
      await setFeatureFlag('newFeature', true);

      const flag = await prisma.featureFlag.findUnique({
        where: { name: 'newFeature' },
      });

      expect(flag).toBeDefined();
      expect(flag?.enabled).toBe(true);
    });

    it('should update existing flag', async () => {
      await setFeatureFlag('updateFeature', true);
      await setFeatureFlag('updateFeature', false);

      const flag = await prisma.featureFlag.findUnique({
        where: { name: 'updateFeature' },
      });

      expect(flag?.enabled).toBe(false);
    });
  });
});
