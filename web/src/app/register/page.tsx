"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react"; // <<< TAMBAHKAN INI

export default function Register() {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); // <<< TAMBAHKAN INI

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <div className="space-y-4">

          {/* NPM */}
          <div className="space-y-2">
            <Label htmlFor="npm">NPM</Label>
            <Input
              id="npm"
              type="text"
              value={npm}
              onChange={(e) => setNpm(e.target.value)}
              placeholder="Masukkan NPM"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"} // <<< GANTI TYPE
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="pr-10"
              />

              {/* TOMBOL SHOW/HIDE */}
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button className="w-full">Daftar</Button>

          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
