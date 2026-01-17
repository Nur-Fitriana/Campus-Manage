import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Ambil data SATU mahasiswa berdasarkan NPM untuk Auto-fill
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const data = await prisma.mahasiswa.findUnique({
      where: { npm: params.slug },
    });
    
    if (!data) return NextResponse.json({ success: false, message: "Mahasiswa tidak ditemukan" }, { status: 404 });
    
    return NextResponse.json({ success: true, mahasiswa: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 });
  }
}

// Update data mahasiswa saat tombol simpan diklik
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.mahasiswa.update({
      where: { npm: params.slug },
      data: {
        namaLengkap: body.namaLengkap,
        email: body.email,
        noTelepon: body.noTelepon,
        alamat: body.alamat,
        status: body.status,
      }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal Update" }, { status: 400 });
  }
}