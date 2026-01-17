import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    // "secret" harus sama dengan yang ada di file login kamu
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    // Mencari data berdasarkan userId
    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: decoded.id },
      include: {
        programStudi: true, // Untuk mendapatkan nama Fakultas & Prodi
      }
    });

    if (!profile) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}