'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {

  const router = useRouter();

  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ===========================
    // LOGIN ADMIN
    // ===========================
    if (npm === "admin" && password === "123") {
      router.push("/dashboard");
      return;
    }

    if (npm === password && npm.length > 0) {
      localStorage.setItem("mhs_npm", npm); 
      router.push("/dashboard/mahasiswa")
      return;
    }

    alert("NPM atau Password salah!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

          {/* TITLE */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Selamat Datang</h1>
            <p className="text-muted-foreground">Silahkan Masuk</p>
          </div>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleLogin}>

            {/* INPUT NPM */}
            <div className="space-y-2">
              <Label htmlFor="npm">Username / NPM</Label>
              <Input
                id="npm"
                type="text"
                placeholder="Masukkan Username atau NPM"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
              />
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <Link
                href="/reset-password"
                className="text-blue-600 hover:underline"
              >
                Lupa Password?
              </Link>
            </div>

            {/* BUTTON LOGIN */}
            <Button type="submit" className="w-full">
              Masuk
            </Button>

            {/* REGISTER */}
            <p className="text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>

          </form>

        </div>
      </motion.div>
    </div>
  );
}
