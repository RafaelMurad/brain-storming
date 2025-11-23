import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { config, featureFlags } from '../config';
import { logger } from '../config/logger';
import { prisma } from '../lib/database';
import { isFeatureEnabledSync, Feature } from '../lib/featureFlags';

// Screenshot options interface
export interface ScreenshotOptions {
  url: string;
  format?: 'png' | 'jpeg' | 'pdf';
  width?: number;
  height?: number;
  fullPage?: boolean;
  delay?: number;
  selector?: string;
  quality?: number;
}

// Screenshot result interface
export interface ScreenshotResult {
  id: string;
  url: string;
  filePath: string;
  format: string;
  width: number;
  height: number;
  fileSize: number;
  processingMs: number;
}

// Browser instance management
let browserInstance: Browser | null = null;

// Get or create browser instance
const getBrowser = async (): Promise<Browser> => {
  if (!browserInstance || !browserInstance.connected) {
    const launchOptions: PuppeteerLaunchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    };

    browserInstance = await puppeteer.launch(launchOptions);
    logger.info('Browser instance created');
  }

  return browserInstance;
};

// Close browser instance
export const closeBrowser = async (): Promise<void> => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    logger.info('Browser instance closed');
  }
};

// Ensure storage directory exists
const ensureStorageDir = async (): Promise<void> => {
  const storageDir = path.resolve(config.storagePath);
  await fs.mkdir(storageDir, { recursive: true });
};

// Take screenshot
export const takeScreenshot = async (
  apiKeyId: string,
  options: ScreenshotOptions
): Promise<ScreenshotResult> => {
  const startTime = Date.now();
  const screenshotId = uuidv4();

  // Validate options against feature flags
  if (options.fullPage && !isFeatureEnabledSync(Feature.FULL_PAGE_CAPTURE)) {
    throw new Error('Full page capture feature is disabled');
  }

  if (options.selector && !isFeatureEnabledSync(Feature.ELEMENT_SELECTOR)) {
    throw new Error('Element selector feature is disabled');
  }

  if (options.delay && options.delay > 0 && !isFeatureEnabledSync(Feature.DELAY_CAPTURE)) {
    throw new Error('Delay capture feature is disabled');
  }

  if (options.format === 'pdf' && !isFeatureEnabledSync(Feature.PDF_EXPORT)) {
    throw new Error('PDF export feature is disabled');
  }

  // Create screenshot record
  const screenshot = await prisma.screenshot.create({
    data: {
      id: screenshotId,
      apiKeyId,
      url: options.url,
      status: 'processing',
      format: options.format || 'png',
      width: Math.min(options.width || 1280, config.maxScreenshotWidth),
      height: Math.min(options.height || 720, config.maxScreenshotHeight),
      fullPage: options.fullPage || false,
      delay: options.delay || 0,
      selector: options.selector,
    },
  });

  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: screenshot.width,
      height: screenshot.height,
      deviceScaleFactor: 1,
    });

    // Navigate to URL
    await page.goto(options.url, {
      waitUntil: 'networkidle2',
      timeout: config.screenshotTimeout,
    });

    // Apply delay if specified
    if (screenshot.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, screenshot.delay));
    }

    // Ensure storage directory exists
    await ensureStorageDir();

    // Generate file path
    const extension = screenshot.format === 'pdf' ? 'pdf' : screenshot.format;
    const fileName = `${screenshotId}.${extension}`;
    const filePath = path.resolve(config.storagePath, fileName);

    let fileBuffer: Buffer;

    if (screenshot.format === 'pdf') {
      // Generate PDF
      fileBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });
    } else {
      // Take screenshot
      const screenshotOptions: Parameters<Page['screenshot']>[0] = {
        type: screenshot.format as 'png' | 'jpeg',
        fullPage: screenshot.fullPage,
      };

      if (screenshot.format === 'jpeg' && options.quality) {
        screenshotOptions.quality = Math.min(100, Math.max(1, options.quality));
      }

      // Capture specific element or full page
      if (screenshot.selector) {
        const element = await page.$(screenshot.selector);
        if (!element) {
          throw new Error(`Element not found: ${screenshot.selector}`);
        }
        fileBuffer = (await element.screenshot(screenshotOptions)) as Buffer;
      } else {
        fileBuffer = (await page.screenshot(screenshotOptions)) as Buffer;
      }
    }

    // Save file
    await fs.writeFile(filePath, fileBuffer);
    const fileSize = fileBuffer.length;
    const processingMs = Date.now() - startTime;

    // Update screenshot record
    await prisma.screenshot.update({
      where: { id: screenshotId },
      data: {
        status: 'completed',
        filePath,
        fileSize,
        processingMs,
        completedAt: new Date(),
      },
    });

    logger.info(`Screenshot captured: ${screenshotId} in ${processingMs}ms`);

    return {
      id: screenshotId,
      url: options.url,
      filePath,
      format: screenshot.format,
      width: screenshot.width,
      height: screenshot.height,
      fileSize,
      processingMs,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Update screenshot record with error
    await prisma.screenshot.update({
      where: { id: screenshotId },
      data: {
        status: 'failed',
        errorMessage,
        processingMs: Date.now() - startTime,
      },
    });

    logger.error(`Screenshot failed: ${screenshotId}`, error);
    throw error;
  } finally {
    if (page) {
      await page.close();
    }
  }
};

// Get screenshot by ID
export const getScreenshot = async (
  id: string
): Promise<{
  screenshot: Awaited<ReturnType<typeof prisma.screenshot.findUnique>>;
  buffer: Buffer | null;
}> => {
  const screenshot = await prisma.screenshot.findUnique({
    where: { id },
  });

  if (!screenshot) {
    throw new Error('Screenshot not found');
  }

  let buffer: Buffer | null = null;

  if (screenshot.filePath && screenshot.status === 'completed') {
    try {
      buffer = await fs.readFile(screenshot.filePath);
    } catch {
      logger.warn(`File not found for screenshot: ${id}`);
    }
  }

  return { screenshot, buffer };
};

// Get screenshots by API key
export const getScreenshotsByApiKey = async (
  apiKeyId: string,
  limit = 50,
  offset = 0
): Promise<Awaited<ReturnType<typeof prisma.screenshot.findMany>>> => {
  return prisma.screenshot.findMany({
    where: { apiKeyId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
};

// Delete screenshot
export const deleteScreenshot = async (id: string): Promise<void> => {
  const screenshot = await prisma.screenshot.findUnique({
    where: { id },
  });

  if (!screenshot) {
    throw new Error('Screenshot not found');
  }

  // Delete file if exists
  if (screenshot.filePath) {
    try {
      await fs.unlink(screenshot.filePath);
    } catch {
      logger.warn(`Could not delete file for screenshot: ${id}`);
    }
  }

  // Delete record
  await prisma.screenshot.delete({
    where: { id },
  });

  logger.info(`Screenshot deleted: ${id}`);
};
