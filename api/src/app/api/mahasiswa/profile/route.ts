import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    // "secret" harus sama persis dengan yang ada di login backend kamu
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: decoded.id }, // Mengambil data berdasarkan userId dari tabel Mahasiswa
      include: {
        programStudi: true, // Mengambil relasi Program Studi
      }
    });

    if (!profile) return NextResponse.json({ error: "Mahasiswa tidak ditemukan" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
  }
}