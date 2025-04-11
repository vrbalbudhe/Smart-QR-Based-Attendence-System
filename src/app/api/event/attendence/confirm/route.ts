import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, eventId, location } = await req.json();

  if (!userId || !eventId || !location) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const session = await prisma.eventSession.findFirst({
      where: {
        participantId: userId,
        eventId: eventId,
      },
      include: {
        AttendenceDetails: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "User is not registered for the event" },
        { status: 403 }
      );
    }

    if (session?.AttendenceDetails?.isAttended == true) {
      return NextResponse.json(
        {
          success: false,
          message: "User ALready Marked Attendence for the event",
        },
        { status: 403 }
      );
    }

    const updatedSession = await prisma.eventSession.update({
      where: { id: session.id },
      data: {
        AttendenceDetails: {
          update: {
            isAttended: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
