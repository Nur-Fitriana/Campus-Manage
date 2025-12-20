import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const prodi = await prisma.programStudi.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" }
    });

    return NextResponse.json({ success: true, data: prodi });
  } catch (error) {
    return NextResponse.json({ success: false, data: [], message: "DB Error" }, { status: 500 });
  }
};