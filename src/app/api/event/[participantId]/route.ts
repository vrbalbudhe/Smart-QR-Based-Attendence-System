import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { participantId: string } }
) {
  try {
    const { participantId } = params;

    const events = await prisma.event.findMany({
      where: { creatorId: participantId },
      include: {
        LocationDetails: true,
        participants: true,
        EventSession: true,
      },
    });

    console.log("Events created by participant:", events);

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
