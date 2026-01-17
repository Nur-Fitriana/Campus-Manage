import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    // Ganti "secret" dengan JWT_SECRET yang ada di .env kamu
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: decoded.id }, // Relasi ke tabel User
      include: {
        programStudi: true, // Mengambil data nama prodi dan fakultas
      }
    });

    if (!profile) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}