import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const participantId = segments[segments.indexOf("event") + 1];

    if (!participantId) {
      return NextResponse.json(
        { message: "Participant ID not found in URL" },
        { status: 400 }
      );
    }

    const events = await prisma.event.findMany({
      where: { creatorId: participantId },
      include: {
        LocationDetails: true,
        participants: true,
        EventSession: true,
      },
    });

    if (events.length === 0) {
      return NextResponse.json(
        { message: "No events found for this participant" },
        { status: 404 }
      );
    }

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events for creator:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
