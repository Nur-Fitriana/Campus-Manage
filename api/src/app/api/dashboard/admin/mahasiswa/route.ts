import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3005",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const data = await prisma.mahasiswa.findMany({
      orderBy: { npm: 'asc' },
      include: { programStudi: true }
    });
    return NextResponse.json({ success: true, mahasiswa: data }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: body.npm,
          email: body.email,
          password: "password123",
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
    return NextResponse.json({ success: true, data: result }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal Simpan" }, { status: 500, headers: corsHeaders });
  }
}