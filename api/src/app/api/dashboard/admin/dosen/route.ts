import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function corsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// Handler untuk mengambil SEMUA data dosen (Tampilan Tabel)
export async function GET() {
  try {
    const allDosen = await prisma.dosen.findMany({
      orderBy: {
        namaLengkap: "asc", // Mengurutkan alfabetis
      },
    });

    // Kembalikan success: true agar frontend mau merender data
    return corsHeaders(
      NextResponse.json({ 
        success: true, 
        data: allDosen 
      })
    );
  } catch (error) {
    console.error("Database Error:", error);
    return corsHeaders(
      NextResponse.json({ 
        success: false, 
        message: "Gagal mengambil data dari database" 
      }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}