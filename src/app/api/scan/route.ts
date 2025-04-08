import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const participantId = searchParams.get("participantId");
  const action = searchParams.get("action");

  if (!eventId || !participantId || !action) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const participant = await prisma.participants.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (action === "reject") {
      return NextResponse.json(
        { message: "Invitation Rejected!" },
        { status: 200 }
      );
    }

    const existingRegistration = await prisma.eventSession.findFirst({
      where: { eventId, participantId },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: "User already registered" },
        { status: 200 }
      );
    }

    const locationDetails = await prisma.locationDetails.create({
      data: { Latitude: "0.0000", Longitude: "0.0000" },
    });

    const attendanceDetails = await prisma.attendenceDetails.create({
      data: {
        isAttended: false,
        participantSelfie: "",
        locationDetailsId: locationDetails.id,
      },
    });

    await prisma.eventSession.create({
      data: {
        eventId,
        participantId,
        attendenceDetailsId: attendanceDetails.id,
      },
    });

    return NextResponse.json(
      { message: "✅ Registration Successful! Welcome to the event." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register participant" },
      { status: 500 }
    );
  }
}
