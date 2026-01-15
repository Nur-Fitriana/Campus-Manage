import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Definisikan Interface untuk Body Request agar tidak pakai 'any'
interface ProdiBody {
  oldKode?: string;
  nama: string;
  kode: string;
  jenjang: string;
  fakultas: string;
}

function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// GET: Ambil semua data prodi
export async function GET() {
  try {
    const data = await prisma.programStudi.findMany({
      orderBy: { nama: "asc" }
    });
    return corsHeaders(NextResponse.json({ success: true, data }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat DB";
    return corsHeaders(NextResponse.json({ success: false, message }, { status: 500 }));
  }
}

// POST: Tambah data prodi baru
export async function POST(req: NextRequest) {
  try {
    const body: ProdiBody = await req.json();

    const newProdi = await prisma.programStudi.create({
      data: {
        nama: body.nama,
        kode: body.kode,
        jenjang: body.jenjang || "S1",
        fakultas: body.fakultas || "TEKNIK",
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: newProdi }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Data tidak lengkap";
    return corsHeaders(NextResponse.json({ success: false, message }, { status: 400 }));
  }
}

// PUT: Update data berdasarkan oldKode (Slug)
export async function PUT(req: NextRequest) {
  try {
    const body: ProdiBody = await req.json();

    if (!body.oldKode) {
      return corsHeaders(NextResponse.json({ success: false, message: "oldKode diperlukan" }, { status: 400 }));
    }

    const updatedProdi = await prisma.programStudi.update({
      where: { kode: body.oldKode },
      data: {
        nama: body.nama,
        kode: body.kode,
        jenjang: body.jenjang,
        fakultas: body.fakultas,
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: updatedProdi }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal update data";
    return corsHeaders(NextResponse.json({ success: false, message }, { status: 400 }));
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}