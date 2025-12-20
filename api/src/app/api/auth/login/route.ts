import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Mengambil credential (bisa npm atau username dari frontend)
    const credential = body.username || body.npm; 
    const password = body.password;

    // 1. Cari user berdasarkan username/npm
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: credential,
          mode: 'insensitive' 
        }
      },
      include: {
        mahasiswa: true,
        dosen: true
      }
    });

    // 2. Jika user tidak ada
    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 401 });
    }

    // 3. Validasi Password (Teks Biasa vs Bcrypt)
    const isHashed = user.password.startsWith('$2');
    let isPasswordValid = false;

    if (isHashed) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = (password === user.password);
    }

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password Salah" }, { status: 401 });
    }

    // 4. Tentukan Nama Display
    let displayName = "User";
    if (user.role === "MAHASISWA") {
      displayName = user.mahasiswa?.namaLengkap || user.username;
    } else if (user.role === "ADMIN") {
      displayName = "Administrator";
    }

    // 5. LOGIKA REDIRECT YANG BENAR (KRUSIAL!)
    // Pastikan string perbandingannya SAMA PERSIS dengan di Database (ADMIN / MAHASISWA)
    let targetRoute = "/dashboard"; // Default

    if (user.role === "ADMIN") {
      targetRoute = "/dashboard/admin";
    } else if (user.role === "MAHASISWA") {
      targetRoute = "/dashboard/mahasiswa";
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        name: displayName,
      },
      redirectTo: targetRoute // Mengirim rute yang berbeda sesuai Role
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}