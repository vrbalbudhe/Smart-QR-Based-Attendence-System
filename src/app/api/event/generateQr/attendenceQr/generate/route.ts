import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventId = body.eventId;

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId in request body" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        name: true,
        from: true,
        to: true,
        venue: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const now = new Date();
    const eventStart = new Date(event.from);
    const eventEnd = new Date(event.to);

    if (now < eventStart) {
      return NextResponse.json(
        { error: "Event has not started yet" },
        { status: 400 }
      );
    }

    if (now > eventEnd) {
      return NextResponse.json({ error: "Event has ended" }, { status: 400 });
    }

    const qrData = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirmAttendence?eventId=${eventId}&status=attendance`;

    const qrImagePath = path.join(process.cwd(), "public/attendanceqrcodes");
    if (!fs.existsSync(qrImagePath)) {
      fs.mkdirSync(qrImagePath, { recursive: true });
    }

    const qrFileName = `attendance_qr_${eventId}.png`;
    const qrFilePath = path.join(qrImagePath, qrFileName);

    await QRCode.toFile(qrFilePath, qrData, {
      type: "png",
      width: 300,
      margin: 2,
    });

    const qrImageUrl = `/attendanceqrcodes/${qrFileName}`;
    await prisma.event.update({
      where: { id: eventId },
      data: { attendenceQrCode: qrImageUrl },
    });

    return NextResponse.json({
      message: "Attendance QR Code generated successfully",
      qrImageUrl,
      eventDetails: event,
    });
  } catch (error) {
    console.error("Attendance QR Code Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate attendance QR" },
      { status: 500 }
    );
  }
}
