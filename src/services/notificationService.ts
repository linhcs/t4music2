import { prisma } from '../lib/prisma';

export class NotificationService {
  static async getUnreadNotifications(userId: number) {
    return prisma.notifications.findMany({
      where: {
        user_id: userId,
        is_read: false
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  static async markAsRead(notificationId: number) {
    return prisma.notifications.update({
      where: {
        notification_id: notificationId
      },
      data: {
        is_read: true
      }
    });
  }

  static async markAllAsRead(userId: number) {
    return prisma.notifications.updateMany({
      where: {
        user_id: userId,
        is_read: false
      },
      data: {
        is_read: true
      }
    });
  }

  static async getNotificationCount(userId: number) {
    return prisma.notifications.count({
      where: {
        user_id: userId,
        is_read: false
      }
    });
  }
} 