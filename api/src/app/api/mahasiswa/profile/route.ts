import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    // Mengambil data mahasiswa berdasarkan userId
    // Kita sertakan (include) programStudi untuk mendapatkan nama fakultas
    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: decoded.id },
      include: {
        programStudi: true,
      }
    });

    if (!profile) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}