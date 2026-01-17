"use client";

import { useState, useEffect } from "react";
import { Poppins } from 'next/font/google';
import { useRouter } from "next/navigation";
import { Mail, MessageSquare, Megaphone, ChevronRight, LogOut, User, BookOpen, FileText } from "lucide-react";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export default function MahasiswaDashboard() {
  const router = useRouter();
  
  const [userName, setUserName] = useState<string>("");
  const [userNPM, setUserNPM] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("BERANDA");

  const doLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const role = localStorage.getItem("user_role");
    const savedName = localStorage.getItem("userName");
    const savedNPM = localStorage.getItem("userNPM");

    if (!token || role !== "MAHASISWA") {
      doLogout();
    } else {
      if (savedName) setUserName(savedName);
      if (savedNPM) setUserNPM(savedNPM);
    }
  }, []);

  // FUNGSI RENDER KONTEN DINAMIS (PENGGANTI ISI TENGAH)
  const renderContent = () => {
    switch (activeTab) {
      case "BIODATA":
        return (
          <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-[#0056b3] font-bold text-[12px] mb-4 border-b pb-2 uppercase flex items-center gap-2 italic">
              <User size={14} /> Profil Mahasiswa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-[11px]">
              <div className="space-y-3">
                <p className="flex flex-col"><span className="text-gray-400 font-bold uppercase tracking-tighter">Nama Lengkap</span> <span className="text-gray-700 font-semibold">{userName}</span></p>
                <p className="flex flex-col"><span className="text-gray-400 font-bold uppercase tracking-tighter">NPM</span> <span className="text-gray-700 font-semibold">{userNPM}</span></p>
              </div>
              <div className="space-y-3">
                <p className="flex flex-col"><span className="text-gray-400 font-bold uppercase tracking-tighter">Program Studi</span> <span className="text-gray-700 font-semibold">S1 INFORMATIKA</span></p>
                <p className="flex flex-col"><span className="text-gray-400 font-bold uppercase tracking-tighter">Fakultas</span> <span className="text-gray-700 font-semibold">TEKNIK DAN ILMU KOMPUTER</span></p>
              </div>
            </div>
          </div>
        );
      case "PERKULIAHAN":
        return (
          <div className="bg-white border border-gray-200 p-10 shadow-sm rounded-sm text-center animate-in fade-in duration-500">
            <BookOpen className="mx-auto mb-3 text-gray-200" size={40} />
            <p className="text-[11px] italic text-gray-400 font-bold uppercase tracking-widest">Informasi Akademik / KRS Belum Tersedia</p>
          </div>
        );
      case "LAPORAN":
        return (
          <div className="bg-white border border-gray-200 p-10 shadow-sm rounded-sm text-center animate-in fade-in duration-500">
            <FileText className="mx-auto mb-3 text-gray-200" size={40} />
            <p className="text-[11px] italic text-gray-400 font-bold uppercase tracking-widest">Belum Ada Laporan Hasil Studi</p>
          </div>
        );
      default: // BERANDA
        return (
          <div className="space-y-5 animate-in fade-in duration-500">
            <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm">
              <h1 className="text-[#0056b3] font-bold text-base mb-2 uppercase tracking-tight">
                Selamat Datang, {userName}
              </h1>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Portal Akademik Universitas Teknokrat Indonesia. Gunakan fasilitas ini untuk memantau perkembangan akademik Anda secara real-time.
              </p>
            </div>

            <div className="bg-[#fff9e6] border border-[#ffeeba] p-4 rounded-sm flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#856404]" />
                <span className="text-[11px] text-[#856404]">Anda memiliki ( <b>0</b> ) pesan baru</span>
              </div>
              <button className="bg-white border border-gray-300 px-3 py-1 text-[9px] font-bold uppercase text-gray-600 hover:bg-gray-50 transition-all">Masuk</button>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
              <div className="bg-[#f8f9fa] px-4 py-2 border-b border-gray-200 text-[#0056b3] font-bold text-[11px] uppercase">
                Diskusi Terbaru
              </div>
              <div className="p-12 text-center text-gray-300 text-[11px] italic">
                <MessageSquare className="mx-auto mb-2 opacity-20" size={30} />
                Tidak ada diskusi terbaru.
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-[#fcfcfc] pb-10`}>
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* KOLOM KIRI: PENGUMUMAN */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
              <div className="bg-[#f8f9fa] px-4 py-2 border-b border-gray-200 text-[#0056b3] font-bold text-[11px] uppercase flex items-center gap-2">
                <Megaphone size={13} /> Pengumuman
              </div>
              <div className="p-4 space-y-4 text-[11px]">
                <p className="text-[#d9534f] font-bold uppercase border-b border-gray-100 pb-1">Informasi Akademik</p>
                <ul className="text-[#0056b3] space-y-2 font-medium">
                  <li className="hover:underline cursor-pointer flex items-center gap-1">
                    <ChevronRight size={10} /> Jadwal Penginputan Genap
                  </li>
                  <li className="hover:underline cursor-pointer flex items-center gap-1">
                    <ChevronRight size={10} /> Pengajuan Kelas Baru
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* KOLOM TENGAH: ISI UTAMA */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* NAVIGASI MENU ATAS */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6 pb-2 px-2 overflow-x-auto scrollbar-hide bg-white py-1 sticky top-0 z-10">
              {['BERANDA', 'BIODATA', 'PERKULIAHAN', 'LAPORAN'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-bold uppercase tracking-widest pb-2 transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab 
                      ? "text-[#d9534f] border-[#d9534f]" 
                      : "text-gray-400 border-transparent hover:text-[#0056b3]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ISI TENGAH YANG BERUBAH-UBAH */}
            {renderContent()}
          </div>

          {/* KOLOM KANAN: PROFIL */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-sm text-center">
              <div className="bg-[#f8f9fa] py-1 mb-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">Informasi Pengguna</div>
              <div className="w-28 h-36 bg-gray-50 border border-gray-200 mx-auto mb-3 flex items-center justify-center text-[9px] text-gray-300 font-bold uppercase p-2 text-center overflow-hidden">
                 PHOTO <br/> {userNPM}
              </div>
              
              <h3 className="text-[#0056b3] font-bold text-[11px] uppercase mb-1 truncate px-2">{userName}</h3>
              <p className="text-gray-500 text-[10px] font-bold">{userNPM}</p>
              <p className="text-gray-400 text-[9px] uppercase italic">S1 Informatika</p>
              
              <button 
                onClick={doLogout} 
                className="mt-5 text-[#d9534f] text-[10px] font-bold hover:underline flex items-center justify-center gap-1 mx-auto w-full pt-3 border-t border-gray-50 uppercase tracking-wider"
              >
                <LogOut size={12} /> Logout
              </button>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
              <div className="bg-[#f8f9fa] px-4 py-2 text-[#d9534f] font-bold text-[11px] uppercase border-b border-gray-200 flex items-center gap-2">
                <BookOpen size={13}/> Academics
              </div>
              <div className="p-1">
                {['Halaman Depan', 'KRS', 'KHS'].map((item) => (
                  <div 
                    key={item} 
                    onClick={() => {
                      if(item === 'Halaman Depan') setActiveTab('BERANDA');
                      if(item === 'KRS' || item === 'KHS') setActiveTab('PERKULIAHAN');
                    }}
                    className="flex items-center gap-2 p-2.5 text-[10px] text-[#856404] hover:bg-yellow-50 cursor-pointer group transition-all"
                  >
                    <ChevronRight size={10} className="text-gray-300 group-hover:text-yellow-600" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}