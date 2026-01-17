import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper untuk CORS
function applyCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params; 
    const data = await prisma.mahasiswa.findUnique({ 
      where: { npm: slug }, 
      include: { programStudi: true }
    });
    
    if (!data) return applyCors(NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 }));
    
    return applyCors(NextResponse.json({ success: true, mahasiswa: data }));
  } catch (error) {
    console.error("GET Error:", error);
    return applyCors(NextResponse.json({ success: false }, { status: 500 }));
  }
}

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
        // TAMBAHKAN INI AGAR PRODI BISA BERUBAH:
        programStudiId: body.programStudiId, 
      },
    });

    return applyCors(NextResponse.json({ success: true, data: updated }));
  } catch (error: unknown) {
    console.error("PUT Error Detail:", error);
    
    let message = "Gagal Update Data";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') message = "Email sudah digunakan mahasiswa lain!";
    }

    return applyCors(NextResponse.json({ success: false, message }, { status: 500 }));
  }
}