import { PrismaClient, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const data = await prisma.mahasiswa.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    success: true,
    mahasiswa: data
  });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  await prisma.mahasiswa.create({
    data: {
      npm: body.npm,
      nama: body.nama,
      programStudi: body.programStudi,
      angkatan: body.angkatan,
      alamat: body.alamat ?? null,
      status: body.status as Status
    }
  });

  return NextResponse.json({
    success: true,
    message: "Data Mahasiswa Berhasil Disimpan"
  });
};
