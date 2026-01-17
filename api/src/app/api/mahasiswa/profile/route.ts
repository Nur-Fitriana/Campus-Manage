import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    // Pastikan JWT_SECRET di .env kamu sudah benar
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    // Mencari di tabel Mahasiswa berdasarkan userId
    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: decoded.id },
      include: {
        programStudi: true, // Ambil relasi ProgramStudi
        dosenWali: true      // Ambil relasi Dosen Wali
      }
    });

    if (!profile) return NextResponse.json({ error: "Data mahasiswa tidak ditemukan" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json({ error: "Sesi berakhir, silakan login kembali" }, { status: 401 });
  }
}