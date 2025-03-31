import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const participantId = searchParams.get("participantId");

  if (!eventId || !participantId) {
    return NextResponse.json({ error: "Invalid QR Code" }, { status: 400 });
  }

  try {
    // Check if participant exists
    const participant = await prisma.participants.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Check if participant is already in the event
    const existingRegistration = await prisma.eventSession.findFirst({
      where: { eventId, participantId },
    });

    if (existingRegistration) {
      return NextResponse.json({ message: "User already registered" });
    }

    // Add the participant to the event
    await prisma.eventSession.create({
      data: {
        eventId,
        participantId,
        attendenceDetailsId: "", // Update with actual AttendenceDetails if needed
      },
    });

    return NextResponse.json({
      message: "User successfully registered for the event",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register participant" },
      { status: 500 }
    );
  }
}
