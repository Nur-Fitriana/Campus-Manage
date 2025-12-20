import { PrismaClient, StatusMahasiswa, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const updated = await prisma.mahasiswa.update({
      where: { npm: slug },
      data: {
        namaLengkap: body.namaLengkap,
        status: body.status as StatusMahasiswa,
        email: body.email,
        noTelepon: body.noTelepon,
        alamat: body.alamat,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    console.error("PRISMA ERROR:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ success: false, message: "Email sudah digunakan" }, { status: 400 });
      }
    }
    const msg = error instanceof Error ? error.message : "Gagal Update";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await prisma.mahasiswa.findUnique({ where: { npm: slug } });
    return NextResponse.json({ success: true, mahasiswa: data });
  } catch (error: unknown) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}