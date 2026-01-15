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

export async function GET() {
  try {
    const data = await prisma.mahasiswa.findMany({
      orderBy: { npm: 'asc' },
      include: { programStudi: true }
    });
    return NextResponse.json({ success: true, data: data }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500, headers: corsHeaders });
  }
}

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

// Tambahkan Fungsi PUT untuk EDIT di sini
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { oldNpm, ...updateData } = body;

    const result = await prisma.mahasiswa.update({
      where: { npm: oldNpm }, // Mencari data berdasarkan slug/npm lama
      data: {
        namaLengkap: updateData.namaLengkap,
        email: updateData.email,
        noTelepon: updateData.noTelepon,
        alamat: updateData.alamat,
        status: updateData.status,
        // Tambahkan field lain jika perlu diupdate
      }
    });

    return NextResponse.json({ success: true, data: result }, { headers: corsHeaders });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Gagal Update" }, { status: 500, headers: corsHeaders });
  }
}

// Tambahkan Fungsi DELETE untuk HAPUS di sini
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID tidak ditemukan" }, { status: 400 });

    await prisma.mahasiswa.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true, message: "Data berhasil dihapus" }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal Hapus" }, { status: 500, headers: corsHeaders });
  }
}