import { PrismaClient, JenisKelamin, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await prisma.dosen.findUnique({ where: { nip: slug } });
    
    if (!data) {
      return corsHeaders(NextResponse.json({ success: false, message: "Dosen tidak ditemukan" }, { status: 404 }));
    }

    return corsHeaders(NextResponse.json({ success: true, data }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const updated = await prisma.dosen.update({
      where: { nip: slug },
      data: {
        namaLengkap: body.namaLengkap,
        email: body.email,
        noTelepon: body.noTelepon,
        alamat: body.alamat,
        jabatan: body.jabatan,
        jenisKelamin: body.jenisKelamin as JenisKelamin,
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: updated }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false, message: "Gagal Update" }, { status: 500 }));
  }
}