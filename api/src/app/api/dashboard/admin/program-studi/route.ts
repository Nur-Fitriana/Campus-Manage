import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Tambahkan "PUT" ke dalam Allowed Methods
function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProdi = await prisma.programStudi.create({
      data: {
        nama: body.nama,
        kode: body.kode,
        jenjang: body.jenjang || "S1",
        fakultas: body.fakultas || "TEKNIK",
      },
    });
    return corsHeaders(NextResponse.json({ success: true, data: newProdi }));
  } catch (error: any) {
    return corsHeaders(
      NextResponse.json({ success: false, message: "Kode sudah ada atau data tidak lengkap" }, { status: 400 })
    );
  }
}

// --- FITUR EDIT (PUT) ---
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { oldKode, nama, kode, jenjang, fakultas } = body;

    // Update berdasarkan oldKode (Slug lama)
    const updatedProdi = await prisma.programStudi.update({
      where: { kode: oldKode },
      data: {
        nama: nama,
        kode: kode,
        jenjang: jenjang,
        fakultas: fakultas,
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: updatedProdi }));
  } catch (error: any) {
    console.error("Update Error:", error.message);
    return corsHeaders(
      NextResponse.json({ success: false, message: "Gagal update data" }, { status: 400 })
    );
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}