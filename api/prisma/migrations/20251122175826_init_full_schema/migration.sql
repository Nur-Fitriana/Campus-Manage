/*
  Warnings:

  - You are about to drop the `Mahasiswa` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MAHASISWA');

-- DropTable
DROP TABLE "Mahasiswa";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "npm" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MAHASISWA',
    "mahasiswaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mahasiswa" (
    "npm" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "programStudi" TEXT NOT NULL,
    "angkatan" TEXT NOT NULL,
    "alamat" TEXT,
    "status" "Status" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("npm")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_npm_key" ON "users"("npm");

-- CreateIndex
CREATE UNIQUE INDEX "users_mahasiswaId_key" ON "users"("mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_npm_key" ON "mahasiswa"("npm");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "mahasiswa"("npm") ON DELETE SET NULL ON UPDATE CASCADE;
