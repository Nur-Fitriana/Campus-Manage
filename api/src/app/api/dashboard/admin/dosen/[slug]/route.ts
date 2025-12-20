import { PrismaClient, Prisma, JenisKelamin } from "@prisma/client"; 
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const PUT = async (
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params; // slug lama (NIP lama)
    const body = await request.json();

    const updated = await prisma.dosen.update({
      where: { nip: slug }, // Cari berdasarkan NIP lama di URL
      data: {
        nip: body.nip, // Update ke NIP baru
        namaLengkap: body.namaLengkap,
        email: body.email,
        jenisKelamin: body.jenisKelamin as JenisKelamin,
        programStudiId: body.programStudiId,
        tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
      },
    });
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    let message = "Gagal update data";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') message = "NIP atau Email sudah digunakan dosen lain!";
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
};