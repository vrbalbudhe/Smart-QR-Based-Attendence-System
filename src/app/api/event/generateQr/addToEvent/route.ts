import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.NEXT_PUBLIC_QR_SECRET_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const participantId = searchParams.get("participantId");
  const token = searchParams.get("token");

  try {
    if (!token || token !== SECRET_KEY) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 403 }
      );
    }

    if (!eventId || !participantId) {
      return NextResponse.json(
        { error: "Missing parameters" },
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
        addQrCode: true,
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

    // const qrData = JSON.stringify({
    //   eventId,
    //   participantId,
    //   eventName: event.name,
    //   venue: event.venue || "N/A",
    //   timestamp: new Date().toISOString(),
    //   action: "register",
    // });
    const qrData = `${process.env.NEXT_PUBLIC_BASE_URL}/api/scan?eventId=${eventId}&participantId=${participantId}`;

    const qrImagePath = path.join(process.cwd(), "public/qrcodes");
    if (!fs.existsSync(qrImagePath)) {
      fs.mkdirSync(qrImagePath, { recursive: true });
    }

    const qrFileName = `qr_${eventId}_${participantId}.png`;
    const qrFilePath = path.join(qrImagePath, qrFileName);

    await QRCode.toFile(qrFilePath, qrData, {
      type: "png",
      width: 300,
      margin: 2,
    });

    const qrImageUrl = `/qrcodes/${qrFileName}`;
    await prisma.event.update({
      where: { id: eventId },
      data: { addQrCode: qrImageUrl },
    });

    // return NextResponse.json({
    //   message: "QR Code Generated Successfully",
    //   qrImagePath: qrImageUrl,
    //   eventDetails: event,
    // });
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/scan?status=success`
    );
  } catch (error) {
    console.error("QR Code Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR" },
      { status: 500 }
    );
  }
}
