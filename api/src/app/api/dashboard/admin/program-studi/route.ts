import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// GET: Ambil semua data prodi untuk list
export async function GET() {
  try {
    const data = await prisma.programStudi.findMany({
      orderBy: { nama: "asc" }
    });
    return corsHeaders(NextResponse.json({ success: true, data }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false, message: "Gagal memuat DB" }, { status: 500 }));
  }
}

// POST: Tambah data prodi baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validasi data wajib sesuai Schema Prisma
    const newProdi = await prisma.programStudi.create({
      data: {
        nama: body.nama,
        kode: body.kode,
        jenjang: body.jenjang || "S1", // Default jika kosong
        fakultas: body.fakultas || "TEKNIK", // Default jika kosong
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: newProdi }));
  } catch (error: any) {
    console.error("Error Simpan:", error.message);
    return corsHeaders(
      NextResponse.json({ success: false, message: "Kode sudah ada atau data tidak lengkap" }, { status: 400 })
    );
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}