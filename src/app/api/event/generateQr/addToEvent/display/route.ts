import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
