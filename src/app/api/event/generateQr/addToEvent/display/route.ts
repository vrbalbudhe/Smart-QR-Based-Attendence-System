import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.indexOf("display") - 1];

    if (!id) {
      return NextResponse.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
      select: { addQrCode: true },
    });

    if (!event || !event.addQrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
    }

    return NextResponse.json({ qrCode: event.addQrCode });
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR code" },
      { status: 500 }
    );
  }
}
