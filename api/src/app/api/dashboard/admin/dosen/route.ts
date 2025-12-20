import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fungsi untuk menambahkan Header CORS secara otomatis
function corsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function GET() {
  try {
    const dosen = await prisma.dosen.findMany({
      orderBy: { namaLengkap: 'asc' },
    });
    
    // Bungkus respon dengan Header CORS
    return corsHeaders(NextResponse.json({ success: true, data: dosen }));
  } catch (error: unknown) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

// WAJIB: Tambahkan fungsi OPTIONS agar browser tidak memblokir "preflight request"
export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}