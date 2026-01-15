import { PrismaClient, JenisKelamin, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fungsi Helper CORS agar port 3005 bisa akses 3004
function corsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  response.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await prisma.dosen.findUnique({ 
      where: { nip: slug },
      include: { programStudi: true } 
    });

    if (!data) {
      return corsHeaders(NextResponse.json({ success: false, message: "Dosen tidak ditemukan" }, { status: 404 }));
    }

    // Menggunakan kunci 'data' agar konsisten dengan frontend di bawah
    return corsHeaders(NextResponse.json({ success: true, data: data }));
  } catch (error: unknown) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Cari dulu user id-nya
      const dosen = await tx.dosen.findUnique({ where: { nip: slug } });
      if (!dosen) throw new Error("Dosen tidak ditemukan");

      // 2. Update data Dosen
      const upDosen = await tx.dosen.update({
        where: { nip: slug },
        data: {
          namaLengkap: body.namaLengkap,
          nidn: body.nidn,
          jabatan: body.jabatan,
          email: body.email,
          noTelepon: body.noTelepon,
          alamat: body.alamat,
          pendidikan: body.pendidikan,
          tempatLahir: body.tempatLahir,
          tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
          jenisKelamin: body.jenisKelamin as JenisKelamin,
        },
      });

      // 3. Sinkronkan Email ke Tabel User
      await tx.user.update({
        where: { id: dosen.userId },
        data: { email: body.email }
      });

      return upDosen;
    });

    return corsHeaders(NextResponse.json({ success: true, data: updated }));
  } catch (error: unknown) {
    console.error("PRISMA ERROR:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return corsHeaders(NextResponse.json({ success: false, message: "NIP/Email sudah digunakan" }, { status: 400 }));
      }
    }
    const msg = error instanceof Error ? error.message : "Gagal Update";
    return corsHeaders(NextResponse.json({ success: false, message: msg }, { status: 500 }));
  }
}