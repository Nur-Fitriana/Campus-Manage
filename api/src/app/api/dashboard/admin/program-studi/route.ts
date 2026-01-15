import { PrismaClient, ProgramStudi } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Definisi Interface untuk Response agar tidak menggunakan 'any'
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
    const data: ProgramStudi[] = await prisma.programStudi.findMany({
      orderBy: { nama: "asc" }
    });
    return corsHeaders(NextResponse.json({ success: true, data } as ApiResponse));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false, message: "Gagal memuat DB" } as ApiResponse, { status: 500 }));
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    // Prisma otomatis memberikan error jika 'jenjang' & 'fakultas' tidak ada
    const newProdi: ProgramStudi = await prisma.programStudi.create({
      data: {
        nama: body.nama,
        kode: body.kode,
        jenjang: body.jenjang, // Ambil dari input frontend
        fakultas: body.fakultas, // Ambil dari input frontend
      },
    });

    return corsHeaders(NextResponse.json({ success: true, data: newProdi } as ApiResponse));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return corsHeaders(
      NextResponse.json({ success: false, message: errorMessage } as ApiResponse, { status: 400 })
    );
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}