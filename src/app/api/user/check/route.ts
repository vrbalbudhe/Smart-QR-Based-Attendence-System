import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token not found" },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(token, SECRET_KEY) as { email: string };
    return NextResponse.json(
      { message: "User authenticated", email: decoded.email },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
