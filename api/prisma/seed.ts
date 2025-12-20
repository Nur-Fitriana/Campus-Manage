import { PrismaClient, Role, JenisKelamin, StatusMahasiswa } from '@prisma/client'

const prisma = new PrismaClient()

interface ProdiMap {
  [key: string]: string;
}

const TEKNOKRAT_DATA = {
  fakultas: [
    {
      nama: 'Fakultas Teknik dan Ilmu Komputer',
      programStudi: [
        { kode: 'IF', nama: 'Informatika', jenjang: 'S1', akreditasi: 'A' },
        { kode: 'SI', nama: 'Sistem Informasi', jenjang: 'S1', akreditasi: 'A' },
        { kode: 'TI', nama: 'Teknologi Informasi', jenjang: 'S1', akreditasi: 'A' },
        { kode: 'TE', nama: 'Teknik Elektro', jenjang: 'S1', akreditasi: 'A' },
      ],
    },
    {
      nama: 'Fakultas Ekonomi dan Bisnis',
      programStudi: [
        { kode: 'MN', nama: 'Manajemen', jenjang: 'S1', akreditasi: 'A' },
        { kode: 'AK', nama: 'Akuntansi', jenjang: 'S1', akreditasi: 'A' },
      ],
    },
  ],
  admin: {
    username: 'admin',
    email: 'admin@teknokrat.ac.id',
    password: 'admin123',
  },
  dosen: [
    { 
        nip: '197001012000031001', 
        nidn: '0001017001', 
        nama: 'A. Ferico Octaviansyah, M.Kom.', 
        prodi: 'IF', 
        gender: JenisKelamin.LAKI_LAKI 
    },
    { 
        nip: '198502152010121002', 
        nidn: '0015028501', 
        nama: 'Debby Alita, M.Cs.', 
        prodi: 'IF', 
        gender: JenisKelamin.PEREMPUAN 
    },
  ],
}

const MAHASISWA_SAMPLES = [
  { npm: '23312036', nama: 'Nur Fitriana', gender: JenisKelamin.PEREMPUAN, angkatan: 2023, prodi: 'IF', semester: 5 },
  { npm: '23312053', nama: 'Trilia Gita Amanda', gender: JenisKelamin.PEREMPUAN, angkatan: 2023, prodi: 'IF', semester: 5 },
  { npm: '23312084', nama: 'Cindy Ayu Esrima Dewi', gender: JenisKelamin.PEREMPUAN, angkatan: 2023, prodi: 'IF', semester: 5 },
]

async function main() {
  console.log('🚀 Memulai Seed Data Universitas Teknokrat Indonesia...')

  // 1. CREATE ADMIN
  await prisma.user.upsert({
    where: { username: TEKNOKRAT_DATA.admin.username },
    update: { 
        password: TEKNOKRAT_DATA.admin.password,
        email: TEKNOKRAT_DATA.admin.email 
    },
    create: {
      username: TEKNOKRAT_DATA.admin.username,
      email: TEKNOKRAT_DATA.admin.email,
      password: TEKNOKRAT_DATA.admin.password,
      role: Role.ADMIN,
    },
  })

  // 2. CREATE PROGRAM STUDI
  const prodiMap: ProdiMap = {}
  for (const fakultas of TEKNOKRAT_DATA.fakultas) {
    for (const prodi of fakultas.programStudi) {
      const created = await prisma.programStudi.upsert({
        where: { kode: prodi.kode },
        update: {},
        create: {
          kode: prodi.kode,
          nama: prodi.nama,
          jenjang: prodi.jenjang,
          fakultas: fakultas.nama,
          akreditasi: prodi.akreditasi,
        },
      })
      prodiMap[prodi.kode] = created.id
    }
  }

  // 3. CREATE DOSEN
  const dosenMap: ProdiMap = {}
  for (const dosenData of TEKNOKRAT_DATA.dosen) {
    const user = await prisma.user.upsert({
      where: { username: dosenData.nip },
      update: { password: 'dosen123' },
      create: {
        username: dosenData.nip,
        email: `${dosenData.nip}@teknokrat.ac.id`,
        password: 'dosen123',
        role: Role.DOSEN,
      },
    })
    
    const dosen = await prisma.dosen.upsert({
      where: { nip: dosenData.nip },
      update: { jenisKelamin: dosenData.gender },
      create: {
        nip: dosenData.nip,
        nidn: dosenData.nidn,
        userId: user.id,
        namaLengkap: dosenData.nama,
        jenisKelamin: dosenData.gender,
        tempatLahir: 'Bandar Lampung',
        tanggalLahir: new Date('1980-01-01'),
        alamat: 'Bandar Lampung',
        noTelepon: '081234567890',
        email: user.email,
        programStudiId: prodiMap[dosenData.prodi],
      },
    })
    dosenMap[dosenData.nip] = dosen.id
  }

  // 4. CREATE MAHASISWA (EMAIL FORMAT: nama_lengkap@teknokrat.ac.id)
  for (const mhsData of MAHASISWA_SAMPLES) {
    const formattedName = mhsData.nama.toLowerCase().replace(/\s+/g, '_');
    const customEmail = `${formattedName}@teknokrat.ac.id`;

    const user = await prisma.user.upsert({
      where: { username: mhsData.npm },
      update: { 
        password: mhsData.npm,
        email: customEmail 
      },
      create: {
        username: mhsData.npm,
        email: customEmail,
        password: mhsData.npm, // Password = NPM (Teks Biasa)
        role: Role.MAHASISWA,
      },
    })

    await prisma.mahasiswa.upsert({
      where: { npm: mhsData.npm },
      update: { 
        jenisKelamin: mhsData.gender,
        email: customEmail 
      },
      create: {
        npm: mhsData.npm,
        userId: user.id,
        namaLengkap: mhsData.nama,
        jenisKelamin: mhsData.gender,
        tempatLahir: 'Bandar Lampung',
        tanggalLahir: new Date('2003-01-01'),
        alamat: 'Bandar Lampung',
        noTelepon: '081234567890',
        email: customEmail,
        angkatan: mhsData.angkatan,
        semesterAktif: mhsData.semester,
        status: StatusMahasiswa.AKTIF,
        programStudiId: prodiMap[mhsData.prodi],
        dosenWaliId: Object.values(dosenMap)[0],
      },
    })
  }

  console.log('✅ Seed Berhasil!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })