import { PrismaClient, ProgramStudi } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Interface response agar tidak menggunakan 'any'
interface ApiResponse {
  success: boolean;
  data?: ProgramStudi | ProgramStudi[];
  message?: string;
}

function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function GET(): Promise<NextResponse> {
  try {
    const data = await prisma.programStudi.findMany({
      orderBy: { nama: "asc" }
    });
    return corsHeaders(NextResponse.json({ success: true, data } as ApiResponse));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false, message: "Gagal ambil data" } as ApiResponse, { status: 500 }));
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    // Pastikan field sesuai dengan schema.prisma (jenjang & fakultas WAJIB)
    const newProdi = await prisma.programStudi.create({
      data: {
        nama: body.nama,
        kode: body.kode,
        jenjang: body.jenjang,
        fakultas: body.fakultas,
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: newProdi } as ApiResponse));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Kesalahan tidak diketahui";
    return corsHeaders(NextResponse.json({ success: false, message: msg } as ApiResponse, { status: 400 }));
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}