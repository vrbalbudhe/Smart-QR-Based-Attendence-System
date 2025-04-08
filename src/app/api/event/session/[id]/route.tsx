import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];

    const body = await req.json();
    const { participantId } = body;

    console.log("Session ID:", id);
    console.log("Participant ID:", participantId);

    const eventSessions = await prisma.eventSession.findMany({
      where: {
        id: id,
        // participantId: participantId,
      },
      include: {
        AttendenceDetails: true,
        Event: true,
        participant: true,
      },
    });

    if (eventSessions.length === 0) {
      return NextResponse.json(
        { message: "No event sessions found for this participant" },
        { status: 404 }
      );
    }

    return NextResponse.json(eventSessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching event sessions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
