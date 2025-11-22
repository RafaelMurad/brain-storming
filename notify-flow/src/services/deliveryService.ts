import { prisma } from '../lib/db';
import { logger } from '../lib/logger';
import { config } from '../config';
import nodemailer from 'nodemailer';

// Email transporter (singleton)
let emailTransporter: nodemailer.Transporter | null = null;

function getEmailTransporter(): nodemailer.Transporter {
  if (!emailTransporter) {
    emailTransporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user && config.smtp.pass
        ? { user: config.smtp.user, pass: config.smtp.pass }
        : undefined,
    });
  }
  return emailTransporter;
}

export interface DeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Send email
async function sendEmail(
  to: string,
  subject: string,
  body: string,
  bodyText?: string
): Promise<DeliveryResult> {
  try {
    const transporter = getEmailTransporter();

    const result = await transporter.sendMail({
      from: config.smtp.from,
      to,
      subject,
      html: body,
      text: bodyText || body.replace(/<[^>]*>/g, ''),
    });

    logger.info('Email sent', { to, messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Email delivery failed', { to, error });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Send webhook
async function sendWebhook(
  url: string,
  payload: Record<string, any>
): Promise<DeliveryResult> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NotifyFlow/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    logger.info('Webhook delivered', { url, status: response.status });
    return { success: true };
  } catch (error) {
    logger.error('Webhook delivery failed', { url, error });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Process a single notification
export async function processNotification(notificationId: string): Promise<void> {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { channel: true },
  });

  if (!notification) {
    logger.warn('Notification not found', { notificationId });
    return;
  }

  if (notification.status !== 'queued' && notification.status !== 'pending') {
    logger.debug('Notification already processed', { notificationId, status: notification.status });
    return;
  }

  // Check if scheduled for later
  if (notification.scheduledFor && new Date(notification.scheduledFor) > new Date()) {
    logger.debug('Notification scheduled for later', { notificationId, scheduledFor: notification.scheduledFor });
    return;
  }

  // Update to sending
  await prisma.notification.update({
    where: { id: notificationId },
    data: { status: 'sending' },
  });

  await prisma.notificationEvent.create({
    data: {
      notificationId,
      type: 'sending',
      data: JSON.stringify({ startedAt: new Date().toISOString() }),
    },
  });

  let result: DeliveryResult;

  try {
    switch (notification.recipientType) {
      case 'email':
        result = await sendEmail(
          notification.recipient,
          notification.subject || 'Notification',
          notification.body || '',
        );
        break;

      case 'webhook':
        const payload = {
          id: notification.id,
          subject: notification.subject,
          body: notification.body,
          data: JSON.parse(notification.data),
          metadata: JSON.parse(notification.metadata),
          timestamp: new Date().toISOString(),
        };
        result = await sendWebhook(notification.recipient, payload);
        break;

      case 'sms':
        // SMS placeholder - integrate with Twilio, AWS SNS, etc.
        logger.info('SMS delivery (placeholder)', { to: notification.recipient });
        result = { success: true, messageId: `sms_${Date.now()}` };
        break;

      case 'push':
        // Push placeholder - integrate with FCM, APNs, etc.
        logger.info('Push delivery (placeholder)', { token: notification.recipient });
        result = { success: true, messageId: `push_${Date.now()}` };
        break;

      default:
        result = { success: false, error: `Unknown recipient type: ${notification.recipientType}` };
    }

    if (result.success) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });

      await prisma.notificationEvent.create({
        data: {
          notificationId,
          type: 'sent',
          data: JSON.stringify({
            messageId: result.messageId,
            sentAt: new Date().toISOString(),
          }),
        },
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if we should retry
    if (notification.retryCount < notification.maxRetries) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'queued',
          retryCount: { increment: 1 },
          errorMessage,
        },
      });

      await prisma.notificationEvent.create({
        data: {
          notificationId,
          type: 'retry',
          data: JSON.stringify({
            attempt: notification.retryCount + 1,
            error: errorMessage,
          }),
        },
      });
    } else {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'failed',
          failedAt: new Date(),
          errorMessage,
        },
      });

      await prisma.notificationEvent.create({
        data: {
          notificationId,
          type: 'failed',
          data: JSON.stringify({
            error: errorMessage,
            attempts: notification.retryCount + 1,
          }),
        },
      });
    }
  }
}

// Worker: Process pending notifications
export async function processQueue(limit: number = 100): Promise<number> {
  const notifications = await prisma.notification.findMany({
    where: {
      status: { in: ['queued', 'pending'] },
      OR: [
        { scheduledFor: null },
        { scheduledFor: { lte: new Date() } },
      ],
    },
    orderBy: [
      { priority: 'asc' },
      { createdAt: 'asc' },
    ],
    take: limit,
    select: { id: true },
  });

  let processed = 0;

  for (const notification of notifications) {
    await processNotification(notification.id);
    processed++;
  }

  return processed;
}
