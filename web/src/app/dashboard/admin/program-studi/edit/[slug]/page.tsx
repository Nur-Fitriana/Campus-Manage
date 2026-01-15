import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3005",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 1. GET: Ambil Semua Prodi
export async function GET() {
  try {
    const data = await prisma.programStudi.findMany({
      orderBy: { kode: 'asc' }
    });
    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memuat data" }, { status: 500, headers: corsHeaders });
  }
}

// 2. POST: Tambah Prodi Baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await prisma.programStudi.create({
      data: {
        nama: body.nama,
        kode: body.kode,
        jenjang: body.jenjang,
        fakultas: body.fakultas
      }
    });
    return NextResponse.json({ success: true, data: result }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Kode prodi sudah ada" }, { status: 400, headers: corsHeaders });
  }
}

// 3. PUT: Update Prodi (Menggunakan oldKode sebagai identitas)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { oldKode, nama, kode, jenjang, fakultas } = body;

    const result = await prisma.programStudi.update({
      where: { kode: oldKode }, // Mencari berdasarkan kode lama dari URL
      data: {
        nama: nama,
        kode: kode, // Memungkinkan perubahan kode prodi itu sendiri
        jenjang: jenjang,
        fakultas: fakultas
      }
    });

    return NextResponse.json({ success: true, data: result }, { headers: corsHeaders });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui data" }, { status: 500, headers: corsHeaders });
  }
}

// 4. DELETE: Hapus Prodi
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kode = searchParams.get("kode");

    if (!kode) return NextResponse.json({ success: false, message: "Kode tidak ditemukan" }, { status: 400 });

    await prisma.programStudi.delete({
      where: { kode: kode }
    });

    return NextResponse.json({ success: true, message: "Data berhasil dihapus" }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Data tidak bisa dihapus karena masih digunakan" }, { status: 400, headers: corsHeaders });
  }
}