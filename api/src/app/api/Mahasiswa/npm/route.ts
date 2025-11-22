import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET detail mahasiswa
export const GET = async (
    req: NextRequest,
    { params }: { params: { npm: string } }
) => {
    const data = await prisma.mahasiswa.findUnique({
        where: { npm: params.npm }
    });

    return NextResponse.json({
        success: true,
        mahasiswa: data
    });
};

// PUT update mahasiswa
export const PUT = async (
    req: NextRequest,
    { params }: { params: { npm: string } }
) => {
    const body = await req.json();

    await prisma.mahasiswa.update({
        where: { npm: params.npm },
        data: {
            nama: body.nama,
            programStudi: body.programStudi,
            angkatan: body.angkatan,
            alamat: body.alamat,
            status: body.status
        }
    });

    return NextResponse.json({
        success: true,
        message: "Data Mahasiswa Berhasil Diupdate"
    });
};

// DELETE mahasiswa
export const DELETE = async (
    req: NextRequest,
    { params }: { params: { npm: string } }
) => {
    await prisma.mahasiswa.delete({
        where: { npm: params.npm }
    });

    return NextResponse.json({
        success: true,
        message: "Data Mahasiswa Berhasil Dihapus"
    });
};
