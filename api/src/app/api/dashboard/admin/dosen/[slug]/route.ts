import { PrismaClient, JenisKelamin } from "@prisma/client"; // WAJIB ADA
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function corsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  response.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// GET: Mengambil data berdasarkan slug (NIP)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } } 
) {
  try {
    const data = await prisma.dosen.findUnique({
      where: { nip: params.slug },
      include: { programStudi: true }
    });

    if (!data) return corsHeaders(NextResponse.json({ success: false, message: "Dosen tidak ditemukan" }, { status: 404 }));
    return corsHeaders(NextResponse.json({ success: true, data }));
  } catch (error) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

// PUT: Update data dosen & user
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      const updatedDosen = await tx.dosen.update({
        where: { nip: params.slug },
        data: {
          namaLengkap: body.namaLengkap,
          jenisKelamin: body.jenisKelamin as JenisKelamin, // Cast agar tidak merah
          email: body.email,
          programStudiId: body.programStudiId,
          tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
        },
      });

      await tx.user.update({
        where: { id: updatedDosen.userId },
        data: { email: body.email }
      });

      return updatedDosen;
    });

    return corsHeaders(NextResponse.json({ success: true, data: result }));
  } catch (error) {
    console.error("Update Error:", error);
    return corsHeaders(NextResponse.json({ success: false, message: "Gagal update data" }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}