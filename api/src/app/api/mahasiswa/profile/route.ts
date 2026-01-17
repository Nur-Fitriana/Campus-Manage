import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Kita langsung masukkan ID Nur Fitriana dari Prisma Studio
    const profile = await prisma.mahasiswa.findUnique({
      where: { userId: "6a5e15b9-067c-4bf8-bb9b-62e5cdb14a7d" }, // ID dari screenshot kamu
      include: {
        programStudi: true,
      }
    });

    if (!profile) return NextResponse.json({ error: "Data tidak ada di Database" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}