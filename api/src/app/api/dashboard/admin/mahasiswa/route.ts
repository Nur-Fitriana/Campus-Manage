import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. GET: Mengambil semua data mahasiswa
export async function GET() {
  try {
    const data = await prisma.mahasiswa.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
  }
}

// 2. POST: Menambah mahasiswa baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await prisma.mahasiswa.create({
      data: {
        npm: body.npm,
        namaLengkap: body.namaLengkap,
        email: body.email,
        noTelepon: body.noTelepon,
        alamat: body.alamat,
        status: body.status || "AKTIF",
      },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menambah data" }, { status: 400 });
  }
}

// 3. PUT: Update data mahasiswa berdasarkan oldNpm
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { oldNpm, npm, namaLengkap, email, noTelepon, alamat, status } = body;

    const updated = await prisma.mahasiswa.update({
      where: { npm: oldNpm }, // Mencari data berdasarkan NPM lama dari URL/slug
      data: {
        npm: npm, // Bisa update ke NPM baru jika diinginkan
        namaLengkap: namaLengkap,
        email: email,
        noTelepon: noTelepon,
        alamat: alamat,
        status: status,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Gagal update data" }, { status: 400 });
  }
}

// 4. DELETE: Menghapus mahasiswa berdasarkan ID atau NPM
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID tidak ditemukan" }, { status: 400 });

    await prisma.mahasiswa.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Data berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 400 });
  }
}