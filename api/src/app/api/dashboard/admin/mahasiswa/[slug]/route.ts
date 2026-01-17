import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3005",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const data = await prisma.mahasiswa.findUnique({
      where: { npm: params.slug }
    });
    if (!data) return NextResponse.json({ success: false }, { status: 404, headers: corsHeaders });
    
    // Harus kirim objek 'mahasiswa' agar terbaca oleh setForm di page.tsx
    return NextResponse.json({ success: true, mahasiswa: data }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.mahasiswa.update({
      where: { npm: params.slug },
      data: {
        namaLengkap: body.namaLengkap,
        email: body.email,
        noTelepon: body.noTelepon,
        alamat: body.alamat,
        status: body.status,
      }
    });
    return NextResponse.json({ success: true, data: updated }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal Update" }, { status: 400, headers: corsHeaders });
  }
}