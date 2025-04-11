import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, eventId } = await req.json();
  console.log("1", userId);
  console.log("2", eventId);
  try {
    if (!userId || !eventId) {
      return NextResponse.json(
        { success: false, message: "Missing userId or eventId" },
        { status: 400 }
      );
    }

    const session = await prisma.eventSession.findFirst({
      where: {
        participantId: userId,
        eventId: eventId,
      },
    });

    if (session) {
      return NextResponse.json({ success: true, registered: true });
    } else {
      return NextResponse.json({ success: true, registered: false });
    }
  } catch (error) {
    console.error("Error checking registration:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
