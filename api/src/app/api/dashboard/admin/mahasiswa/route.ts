import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ambil Data Mahasiswa (GET)
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { npm: params.slug }
    });
    
    if (!mahasiswa) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    
    return NextResponse.json({ success: true, mahasiswa });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Update Data Mahasiswa (PUT)
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
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
    return NextResponse.json({ success: false, error: "Gagal update" }, { status: 500 });
  }
}