import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { notification_id: string } }
) {
  try {
    const notification_id = parseInt(params.notification_id);
    const { is_read } = await req.json();

    if (isNaN(notification_id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    const updatedNotification = await prisma.notifications.update({
      where: { notification_id },
      data: { is_read },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { notification_id: string } }
) {
  try {
    const notification_id = parseInt(params.notification_id);

    if (isNaN(notification_id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    await prisma.notifications.delete({
      where: { notification_id },
    });

    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
