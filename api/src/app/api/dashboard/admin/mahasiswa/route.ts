import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// VIEW ALL (GET)
export async function GET() {
  try {
    const data = await prisma.mahasiswa.findMany({
      orderBy: { npm: 'asc' },
      include: { programStudi: true }
    });
    return NextResponse.json({ success: true, mahasiswa: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 });
  }
}

// ADD NEW (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Transaksi: Buat User dulu baru Mahasiswa
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: body.npm,
          email: body.email,
          password: "password123", // Default
          role: "MAHASISWA",
        }
      });

      return await tx.mahasiswa.create({
        data: {
          npm: body.npm,
          userId: newUser.id,
          namaLengkap: body.namaLengkap,
          jenisKelamin: body.jenisKelamin,
          tempatLahir: body.tempatLahir || "-",
          tanggalLahir: new Date(body.tanggalLahir),
          alamat: body.alamat || "-",
          noTelepon: body.noTelepon,
          email: body.email,
          angkatan: parseInt(body.angkatan),
          programStudiId: body.programStudiId, 
          status: "AKTIF"
        }
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal Simpan" }, { status: 500 });
  }
}