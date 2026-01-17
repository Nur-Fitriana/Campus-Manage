import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper CORS yang disamakan dengan contoh Dosen
function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// GET: Mengambil satu data mahasiswa (Auto-fill)
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params; // Menunggu params sesuai standar terbaru Next.js
    
    const data = await prisma.mahasiswa.findUnique({ 
      where: { npm: slug },
      include: { programStudi: true } // Menampilkan data prodi agar mirip contoh dosen
    });
    
    if (!data) {
      return corsHeaders(NextResponse.json({ success: false, message: "Mahasiswa tidak ditemukan" }, { status: 404 }));
    }

    // Mengembalikan key 'mahasiswa' agar terbaca oleh kode Frontend kamu
    return corsHeaders(NextResponse.json({ success: true, mahasiswa: data }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

// PUT: Mengupdate data mahasiswa
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const updated = await prisma.mahasiswa.update({
      where: { npm: slug },
      data: {
        namaLengkap: body.namaLengkap,
        email: body.email,
        noTelepon: body.noTelepon,
        alamat: body.alamat,
        status: body.status,
        // Tambahkan field lain jika perlu, pastikan sesuai dengan schema.prisma
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: updated }));
  } catch (error) {
    console.error(error);
    return corsHeaders(NextResponse.json({ success: false, message: "Gagal Update" }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}
