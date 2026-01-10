import { PrismaClient, Prisma, JenisKelamin } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper Fungsi CORS agar port 3005 bisa akses 3004
function corsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3005");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// 1. GET: Menampilkan daftar dosen
export async function GET(): Promise<NextResponse> {
  try {
    const dosen = await prisma.dosen.findMany({
      orderBy: { namaLengkap: 'asc' },
      include: { programStudi: true }
    });
    return corsHeaders(NextResponse.json({ success: true, data: dosen }));
  } catch (error: unknown) {
    return corsHeaders(NextResponse.json({ success: false }, { status: 500 }));
  }
}

// 2. POST: Menyimpan dosen baru (Transaction agar User & Dosen sinkron)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      // Langkah A: Buat User (Penting: kurung tutup }); harus benar di sini)
      const user = await tx.user.create({
        data: {
          username: body.nip,
          email: body.email,
          password: "password123", // Password default
          role: "DOSEN",
        },
      });

      // Langkah B: Buat data Dosen (Semua field wajib di schema dimasukkan di sini)
      return await tx.dosen.create({
        data: {
          nip: body.nip,
          userId: user.id, // ID dari user yang baru dibuat di atas
          namaLengkap: body.namaLengkap,
          jenisKelamin: body.jenisKelamin as JenisKelamin,
          tempatLahir: body.tempatLahir || "-", // Wajib ada di skema kamu
          tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
          alamat: body.alamat || "-", // Wajib ada di skema kamu (Text)
          noTelepon: body.noTelepon || "",
          email: body.email,
          programStudiId: body.programStudiId,
        },
      });
    });

    return corsHeaders(NextResponse.json({ success: true, data: result }));

  } catch (error: unknown) {
    let errorMessage = "Gagal simpan data";
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        errorMessage = "NIP atau Email sudah terdaftar!";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error Simpan:", errorMessage);
    return corsHeaders(
      NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
    );
  }
}

// 3. OPTIONS: Menangani Preflight Request (Menghilangkan error 405/CORS)
export async function OPTIONS(): Promise<NextResponse> {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}