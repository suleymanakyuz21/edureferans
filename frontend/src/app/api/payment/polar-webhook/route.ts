import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // In production, you must verify the Polar webhook signature here!
    // For now, we process the payload assuming it's from Polar.

    // Example Polar payload structure for a successful order or subscription:
    // { "type": "order.created", "data": { "customer_email": "user@example.com", ... } }
    
    const eventType = payload.type;
    
    // We care about successful orders or subscriptions
    if (eventType === 'order.created' || eventType === 'subscription.created') {
      const email = payload.data?.customer_email || payload.data?.email;
      
      if (email) {
        // Upgrade the user to Premium
        await prisma.user.update({
          where: { email: email.toLowerCase() },
          data: { isPremium: true }
        });
        
        console.log(`Successfully upgraded user ${email} to Pro via Polar webhook.`);
        return successResponse({ upgraded: true });
      }
    }
    
    return successResponse({ received: true });
  } catch (error) {
    console.error('Polar webhook error:', error);
    return errorResponse('Webhook processing failed', 500);
  }
}
