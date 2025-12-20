'use client';

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Poppins } from 'next/font/google';
import { Eye, EyeOff } from "lucide-react";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
});

export default function LoginPage() {
  const router = useRouter();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Logic untuk session check
  }, [router]);

  // NAMA FUNGSI SUDAH MENJADI doLogin
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential || !password) return alert("Lengkapi data!");

    setIsLoading(true);
    try {
      // Menghubungi port backend 3004 sesuai log terminal kamu
      const response = await fetch("http://localhost:3004/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Menggunakan 'username' agar fleksibel untuk Admin (username) maupun Mahasiswa (NPM)
        body: JSON.stringify({ username: credential, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return alert(data.message || "Gagal Login");
      }

      // MENYIMPAN DATA DARI BACKEND KE LOCALSTORAGE
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("userName", data.user?.name || data.user?.namaLengkap || "PENGGUNA");
      localStorage.setItem("user_role", data.user?.role || data.role);
      
      // REDIRECT DINAMIS BERDASARKAN ROLE
      const role = data.user?.role || data.role;
      
      if (role === "ADMIN") {
        router.replace("/dashboard/admin");
      } else if (role === "MAHASISWA") {
        router.replace("/dashboard/mahasiswa");
      } else {
        router.replace(data.redirectTo || "/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error. Pastikan backend di port 3004 menyala.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} relative min-h-screen w-full flex items-center justify-center overflow-hidden`}>
      
      {/* Background Merah Full */}
      <div className="fixed inset-0 bg-[#800000] z-0"></div>

      {/* Kotak Putih Form */}
      <div className="relative z-10 w-full max-w-[350px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mx-4">

        {/* Header Logo */}
        <div className="pt-8 pb-2 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-1 overflow-hidden shadow-sm">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a0/UNIVERSITASTEKNOKRAT.png"
              alt="Logo UTI"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-xl font-extrabold text-[#800000] tracking-normal uppercase leading-tight">Campus Manage</h1>
          <p className="text-[10px] font-semibold text-slate-400 text-center px-4 leading-tight">
            Universitas Teknokrat Indonesia
          </p>
        </div>

        {/* Area Form */}
        <div className="px-8 pb-8">
          <h2 className="text-center text-lg font-bold text-slate-800 uppercase mb-4">
            Selamat Datang
          </h2>

          <form onSubmit={doLogin} className="space-y-4">
            {/* Input Username/NPM */}
            <div className="space-y-1">
              <Label htmlFor="credential" className="text-slate-900 font-bold text-[10px] ml-1">
                Username / NPM / NIP
              </Label>
              <Input
                id="credential"
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="h-10 border-slate-200 focus:border-[#800000] rounded-xl text-xs placeholder:text-slate-400 font-bold"
                placeholder="Masukkan ID Anda"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-900 font-bold text-[10px] ml-1">
                Password
              </Label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs placeholder:text-slate-400 font-bold focus:outline-none focus:border-[#800000] pr-10 transition-all shadow-sm"
                  placeholder="Masukkan Password Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center justify-center text-slate-400 hover:text-[#800000] focus:outline-none bg-white"
                >
                  {showPassword ? <Eye size={16} strokeWidth={2.5} /> : <EyeOff size={16} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {/* Button Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#800000] hover:bg-[#a00000] text-white font-bold h-10 rounded-xl text-xs transition-all shadow-md active:scale-95"
              >
                {isLoading ? "MASUK..." : "MASUK"}
              </Button>

              <div className="text-center mt-3">
                <p className="text-[10px] text-slate-500 font-semibold">
                  Lupa password? <span className="text-[#800000] font-bold cursor-pointer hover:underline">Admin IT</span>
                </p>
              </div>
            </div>
          </form>

          {/* Footer Copyright */}
          <div className="text-center mt-6">
            <p className="text-[8px] text-slate-300 font-bold tracking-tight uppercase">
              © 2025 Universitas Teknokrat Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}