-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AKTIF', 'CUTI', 'TIDAK_AKTIF', 'LULUS');

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "npm" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "programStudi" TEXT NOT NULL,
    "alamat" TEXT,
    "status" "Status" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("npm")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_npm_key" ON "Mahasiswa"("npm");
