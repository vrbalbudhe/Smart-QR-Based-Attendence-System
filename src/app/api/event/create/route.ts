import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, from, to, venue, location, creatorId } = body;

    const event = await prisma.event.create({
      data: {
        name,
        from: new Date(from),
        to: new Date(to),
        venue,
        creatorId,
        LocationDetails: {
          create: {
            Latitude: location.latitude,
            Longitude: location.longitude,
          },
        },
        participants: { create: [] },
        EventSession: { create: [] },
      },
      include: { LocationDetails: true },
    });

    const updatedEvent = await prisma.event.findUnique({
      where: { id: event.id },
      include: { LocationDetails: true },
    });

    if (!updatedEvent?.LocationDetails) {
      throw new Error("Location details not found after event creation");
    }
    const qrCodeData = `${process.env.NEXT_PUBLIC_BASE_URL}/scan/${updatedEvent.id}`;
    const qrImagePath = path.join(process.cwd(), "public/qrcodes");
    if (!fs.existsSync(qrImagePath)) {
      fs.mkdirSync(qrImagePath, { recursive: true });
    }

    const qrFileName = `qr_event_${updatedEvent.id}.png`;
    const qrFilePath = path.join(qrImagePath, qrFileName);

    await QRCode.toFile(qrFilePath, qrCodeData, {
      type: "png",
      width: 300,
      margin: 2,
    });

    const qrImageUrl = `/qrcodes/${qrFileName}`;
    await prisma.event.update({
      where: { id: updatedEvent.id },
      data: { addQrCode: qrImageUrl },
    });

    return NextResponse.json(
      { ...updatedEvent, qrCodePath: qrImageUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { LocationDetails: true, participants: true },
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
