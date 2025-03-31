import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      from,
      to,
      venue,
      addQrCode,
      attendenceQrCode,
      location,
      creatorId,
    } = body;

    console.log(creatorId)

    const event = await prisma.event.create({
      data: {
        name,
        from: new Date(from),
        to: new Date(to),
        venue,
        addQrCode,
        attendenceQrCode,
        LocationDetails: {
          create: {
            Latitude: location.latitude,
            Longitude: location.longitude,
          },
        },
        creatorId,
        participants: { create: [] },  // Ensure this is an array if needed
        EventSession: { create: [] },  // Ensure this is an array if needed
      },
      include: {
        LocationDetails: true,
        participants: true,
      },
    });
    

    const qrCodeData = JSON.stringify({
      id: event.id,
      from: event.from,
      to: event.to,
      venue: event.venue,
      latitude: event.LocationDetails?.Latitude,
      longitude: event.LocationDetails?.Longitude,
    });
    const qrCodeURL = await QRCode.toDataURL(qrCodeData);

    await prisma.event.update({
      where: { id: event.id },
      data: { addQrCode: qrCodeURL },
    });

    return NextResponse.json({ ...event, qrCode: qrCodeURL }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// Handle GET request (Fetch Events)
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        LocationDetails: true,
        participants: true,
      },
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
