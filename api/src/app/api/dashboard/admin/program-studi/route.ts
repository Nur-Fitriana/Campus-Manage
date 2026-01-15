import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// AMBIL SEMUA DATA (Mencegah success: false di browser)
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

// TAMBAH DATA BARU (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProdi = await prisma.programStudi.create({
      data: {
        nama: body.nama,
        kode: body.kode,
      },
    });
    return corsHeaders(NextResponse.json({ success: true, data: newProdi }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false, message: "Kode Prodi sudah ada!" }, { status: 400 }));
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}