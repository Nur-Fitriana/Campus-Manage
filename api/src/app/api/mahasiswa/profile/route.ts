import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    // Gunakan secret yang sama dengan saat Login
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: decoded.id }, // Relasi One-to-One
      include: {
        programStudi: true, // Untuk ambil nama Fakultas & Prodi
      }
    });

    if (!profile) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }
}