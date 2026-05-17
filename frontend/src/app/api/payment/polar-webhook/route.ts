import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { processPremiumUpgrade } from '@/lib/premiumUpgrade';

const WEBHOOK_TOLERANCE_SECONDS = 300; // 5 minutes

function verifyPolarSignature(
  body: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  secret: string
): boolean {
  // Standard Webhooks verification (https://www.standardwebhooks.com/)
  // Secret format: whsec_<base64url-encoded-key>
  const secretKey = Buffer.from(secret.slice(6), 'base64url');

  // Replay-attack prevention: reject events older than tolerance window
  const timestamp = parseInt(webhookTimestamp, 10);
  if (isNaN(timestamp)) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestamp) > WEBHOOK_TOLERANCE_SECONDS) return false;

  const signedContent = `${webhookId}.${webhookTimestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(signedContent)
    .digest('base64');

  // webhook-signature header may contain multiple signatures: "v1,sig1 v1,sig2"
  const signatures = webhookSignature.split(' ');
  return signatures.some((sig) => {
    const sigValue = sig.split(',')[1];
    return sigValue && crypto.timingSafeEqual(Buffer.from(sigValue), Buffer.from(expectedSignature));
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  const webhookId = request.headers.get('webhook-id') ?? '';
  const webhookTimestamp = request.headers.get('webhook-timestamp') ?? '';
  const webhookSignature = request.headers.get('webhook-signature') ?? '';
  const secret = process.env.POLAR_WEBHOOK_SECRET;

  if (!secret) {
    console.error('POLAR_WEBHOOK_SECRET is not configured');
    return new Response('Webhook not configured', { status: 500 });
  }

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return new Response('Missing webhook headers', { status: 400 });
  }

  const isValid = verifyPolarSignature(body, webhookId, webhookTimestamp, webhookSignature, secret);
  if (!isValid) {
    console.warn('Polar webhook signature verification failed');
    return new Response('Invalid signature', { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const eventType = payload.type as string;

  if (eventType === 'order.created' || eventType === 'subscription.active') {
    const data = payload.data as Record<string, unknown>;
    const polarOrderId = data.id as string | undefined;
    const customer = data.customer as Record<string, unknown> | undefined;
    const email = (customer?.email as string | undefined)?.toLowerCase()
      ?? (data.customer_email as string | undefined)?.toLowerCase();

    if (!email) {
      console.error('Polar webhook: no customer email in payload', payload);
      return new Response('No email', { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // User may not have registered yet — log and return 200 to prevent Polar retries
      console.warn(`Polar webhook: no user found for email ${email}`);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    await prisma.$transaction((tx) => processPremiumUpgrade(user.id, tx, polarOrderId));
    console.log(`Polar webhook: upgraded ${email} to Premium (order: ${polarOrderId})`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
