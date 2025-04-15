import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        EventSession: {
          include: {
            participant: true,
            AttendenceDetails: {
              include: {
                locationDetails: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      { header: "Participant Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Attended", key: "attended", width: 10 },
      { header: "Location", key: "location", width: 50 },
      { header: "TimeStamp", key: "timeStamp", width: 50 },
    ];

    event.EventSession.forEach((session) => {
      const { participant, AttendenceDetails } = session;

      worksheet.addRow({
        name: participant?.name || "N/A",
        email: participant?.email || "N/A",
        attended: AttendenceDetails?.isAttended ? "Yes" : "No",
        location: AttendenceDetails?.locationDetails?.location || "",
        timeStamp: AttendenceDetails?.locationDetails?.createdAt || "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="event-${eventId}-attendance.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel" },
      { status: 500 }
    );
  }
}
