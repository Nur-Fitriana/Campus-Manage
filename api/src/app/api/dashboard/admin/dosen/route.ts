import { PrismaClient, JenisKelamin } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Definisi Interface untuk Body Request
interface DosenCreateInput {
    nip: string;
    nidn: string;
    userId: string;
    namaLengkap: string;
    jenisKelamin: JenisKelamin;
    email: string;
    pendidikan: string;
    jabatan: string;
    programStudiId: string;
    noTelepon: string;
    alamat: string;
    tempatLahir: string;
    tanggalLahir: string;
}

export const GET = async () => {
    try {
        const data = await prisma.dosen.findMany({
            include: { programStudi: true },
            orderBy: { namaLengkap: "asc" }
        });
        return NextResponse.json({ success: true, dosen: data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal mengambil data";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    try {
        const body: DosenCreateInput = await request.json();

        const check = await prisma.dosen.findUnique({ where: { nip: body.nip } });
        if (check) {
            return NextResponse.json({ message: "NIP sudah terdaftar!", success: false }, { status: 400 });
        }

        const newDosen = await prisma.dosen.create({
            data: {
                nip: body.nip,
                nidn: body.nidn,
                userId: body.userId,
                namaLengkap: body.namaLengkap,
                jenisKelamin: body.jenisKelamin,
                email: body.email,
                pendidikan: body.pendidikan,
                jabatan: body.jabatan,
                programStudiId: body.programStudiId,
                noTelepon: body.noTelepon,
                alamat: body.alamat,
                tempatLahir: body.tempatLahir,
                tanggalLahir: new Date(body.tanggalLahir),
            }
        });

        return NextResponse.json({ success: true, data: newDosen });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal tambah dosen";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};