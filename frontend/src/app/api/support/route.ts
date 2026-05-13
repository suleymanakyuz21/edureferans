import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return errorResponse('Tüm alanlar zorunludur.');
    }

    const ticket = await prisma.supportTicket.create({
      data: { name, email, message, status: 'OPEN' },
    });

    return successResponse(ticket, 'Destek talebiniz alındı. En kısa sürede dönüş yapacağız.', 201);
  } catch (error) {
    console.error('Support POST error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
