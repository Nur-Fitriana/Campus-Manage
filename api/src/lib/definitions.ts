export type Mahasiswa = {
    npm: string;
    name: string;
    studyProgram: 'Teknik Informatika' | 'Sistem Informasi' | 'Manajemen';
    address: string;
    status: 'Aktif' | 'Tidak Aktif' | 'Cuti' | 'Lulus';
  };
  
  // Tipe data untuk form error handling di sisi frontend
  export type FormState = {
    message: string;
    errors?: {
      npm?: string[];
      name?: string[];
      // ...
    };
  };