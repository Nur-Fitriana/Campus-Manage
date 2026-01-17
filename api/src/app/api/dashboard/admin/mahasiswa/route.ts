import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Ambil data satu mahasiswa berdasarkan NPM (Auto-fill)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await prisma.mahasiswa.findUnique({
      where: { npm: params.slug },
      include: { programStudi: true }
    });

    if (!data) {
      return NextResponse.json({ success: false, message: "Mahasiswa tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 });
  }
}

// Simpan perubahan data mahasiswa (Update)
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
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
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal Update Data" }, { status: 500 });
  }
}