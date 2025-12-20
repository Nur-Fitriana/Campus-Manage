import { PrismaClient } from "@prisma/client"; 
import { NextRequest, NextResponse } from "next/server";

// Inisialisasi prisma agar bisa digunakan di bawah
const prisma = new PrismaClient();

interface DosenUpdateInput {
    namaLengkap?: string;
    email?: string;
    noTelepon?: string;
    alamat?: string;
    jabatan?: string;
}

export const GET = async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    try {
        const { slug } = await params;
        const data = await prisma.dosen.findUnique({
            where: { nip: slug },
            include: { programStudi: true }
        });

        if (!data) return NextResponse.json({ message: "Dosen tidak ditemukan" }, { status: 404 });
        return NextResponse.json({ success: true, dosen: data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal mengambil data";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    try {
        const { slug } = await params;
        const body: DosenUpdateInput = await request.json();

        const updated = await prisma.dosen.update({
            where: { nip: slug },
            data: body
        });
        
        return NextResponse.json({ success: true, data: updated });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal update";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};

// Tambahkan DELETE sekalian agar lengkap
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    try {
        const { slug } = await params;
        
        await prisma.dosen.delete({
            where: { nip: slug }
        });

        return NextResponse.json({ success: true, message: "Dosen berhasil dihapus" });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: "Gagal menghapus dosen" }, { status: 500 });
    }
};