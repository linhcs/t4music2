import { NextResponse } from 'next/server';
import { NotificationService } from '@/services/notificationService';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const count = url.searchParams.get('count');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (count === 'true') {
      const count = await NotificationService.getNotificationCount(Number(userId));
      return NextResponse.json({ count });
    }

    const notifications = await NotificationService.getUnreadNotifications(Number(userId));
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const notificationId = url.searchParams.get('notificationId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (notificationId) {
      await NotificationService.markAsRead(Number(notificationId));
    } else {
      await NotificationService.markAllAsRead(Number(userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function HEAD(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const count = await NotificationService.getNotificationCount(Number(userId));
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 