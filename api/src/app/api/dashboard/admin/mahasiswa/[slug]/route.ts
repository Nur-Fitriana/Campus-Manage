import { PrismaClient, StatusMahasiswa, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Konfigurasi Header Izin Akses (CORS)
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3005",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// WAJIB: Menangani Pre-flight request dari browser
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 1. VIEW ALL & VIEW SINGLE (GET)
export async function GET(
  req: NextRequest,
  context: { params?: Promise<{ slug: string }> }
) {
  try {
    // Jika ada slug (NPM), ambil satu data. Jika tidak, ambil semua.
    const params = await context.params;
    
    if (params?.slug) {
      const data = await prisma.mahasiswa.findUnique({ where: { npm: params.slug } });
      return NextResponse.json({ success: true, mahasiswa: data }, { headers: corsHeaders });
    }

    const data = await prisma.mahasiswa.findMany({
      orderBy: { npm: 'asc' },
      include: { programStudi: true }
    });
    return NextResponse.json({ success: true, mahasiswa: data }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500, headers: corsHeaders });
  }
}

// 2. ADD NEW (POST)
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

// 3. UPDATE DATA (PUT)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const updated = await prisma.mahasiswa.update({
      where: { npm: slug },
      data: {
        namaLengkap: body.namaLengkap,
        status: body.status as StatusMahasiswa,
        email: body.email,
        noTelepon: body.noTelepon,
        alamat: body.alamat,
      },
    });

    return NextResponse.json({ success: true, data: updated }, { headers: corsHeaders });
  } catch (error: unknown) {
    console.error("PRISMA ERROR:", error);
    const msg = error instanceof Error ? error.message : "Gagal Update";
    return NextResponse.json({ success: false, message: msg }, { status: 500, headers: corsHeaders });
  }
}