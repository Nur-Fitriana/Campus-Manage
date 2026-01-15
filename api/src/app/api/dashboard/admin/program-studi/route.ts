import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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

export async function GET() {
  try {
    const data = await prisma.programStudi.findMany({ orderBy: { nama: "asc" } });
    return corsHeaders(NextResponse.json({ success: true, data }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ProdiBody = await req.json();
    const newProdi = await prisma.programStudi.create({
      data: { nama: body.nama, kode: body.kode, jenjang: body.jenjang, fakultas: body.fakultas },
    });
    return corsHeaders(NextResponse.json({ success: true, data: newProdi }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 400 }));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: ProdiBody = await req.json();
    const updated = await prisma.programStudi.update({
      where: { kode: body.oldKode },
      data: { 
        nama: body.nama, 
        kode: body.kode, 
        jenjang: body.jenjang, 
        fakultas: body.fakultas 
      },
    });
    return corsHeaders(NextResponse.json({ success: true, data: updated }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false, message: "Gagal Update" }, { status: 400 }));
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return corsHeaders(NextResponse.json({ success: false }, { status: 400 }));

    await prisma.programStudi.delete({ where: { id } });
    return corsHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 400 }));
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}