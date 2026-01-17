import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "rahasia_campus_manage123") as { id: string };

    // Kode Prisma diletakkan DI SINI (Server Side)
    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: decoded.id }, 
      include: { programStudi: true }
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}