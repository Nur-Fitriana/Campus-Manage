import { PrismaClient, JenisKelamin } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function corsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  response.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } } 
) {
  try {
    const data = await prisma.dosen.findUnique({
      where: { nip: params.slug },
      include: { programStudi: true }
    });
    if (!data) return corsHeaders(NextResponse.json({ success: false, message: "Dosen tidak ditemukan" }, { status: 404 }));
    return corsHeaders(NextResponse.json({ success: true, data }));
  } catch (error: unknown) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update data Dosen sesuai Schema Prisma
      const updatedDosen = await tx.dosen.update({
        where: { nip: params.slug },
        data: {
          namaLengkap: body.namaLengkap,
          nidn: body.nidn,
          jenisKelamin: body.jenisKelamin as JenisKelamin,
          tempatLahir: body.tempatLahir,
          tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
          alamat: body.alamat,
          noTelepon: body.noTelepon,
          email: body.email,
          pendidikan: body.pendidikan,
          jabatan: body.jabatan,
          programStudiId: body.programStudiId,
        },
      });

      // 2. Update Email di Tabel User (Sinkronisasi)
      await tx.user.update({
        where: { id: updatedDosen.userId },
        data: { email: body.email }
      });

      return updatedDosen;
    });

    return corsHeaders(NextResponse.json({ success: true, data: result }));
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal update data";
    return corsHeaders(NextResponse.json({ success: false, message: errorMsg }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}