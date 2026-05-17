import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get('to') ?? 'test@example.com';
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'EduReferans Test Email',
    html: '<p>Test email — eğer bunu gördüysen Resend çalışıyor!</p>',
  });

  return NextResponse.json({
    apiKeyPrefix: apiKey.slice(0, 8),
    to,
    result,
  });
}
