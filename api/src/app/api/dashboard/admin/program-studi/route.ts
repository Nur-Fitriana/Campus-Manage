import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Definisi Interface untuk Body Request saat membuat Prodi baru
interface ProgramStudiCreateInput {
  kode: string;
  nama: string;
  jenjang: string;
  fakultas: string;
  akreditasi: string;
  ketuaProgramStudi?: string;
  visi?: string;
  misi?: string;
}

// 1. GET: Mengambil semua daftar Program Studi
export const GET = async () => {
  try {
    const data = await prisma.programStudi.findMany({
      orderBy: { nama: "asc" },
      include: {
        _count: {
          select: { mahasiswa: true, dosen: true } // Menghitung jumlah mhs & dosen per prodi
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data program studi";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
};

// 2. POST: Menambah Program Studi baru
export const POST = async (request: NextRequest) => {
  try {
    const body: ProgramStudiCreateInput = await request.json();

    // Validasi duplikasi kode prodi
    const existingProdi = await prisma.programStudi.findUnique({
      where: { kode: body.kode }
    });

    if (existingProdi) {
      return NextResponse.json({ 
        success: false, 
        message: `Program studi dengan kode ${body.kode} sudah ada.` 
      }, { status: 400 });
    }

    const newProdi = await prisma.programStudi.create({
      data: {
        kode: body.kode,
        nama: body.nama,
        jenjang: body.jenjang,
        fakultas: body.fakultas,
        akreditasi: body.akreditasi,
        ketuaProgramStudi: body.ketuaProgramStudi,
        visi: body.visi,
        misi: body.misi,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Program Studi berhasil dibuat", 
      data: newProdi 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
};