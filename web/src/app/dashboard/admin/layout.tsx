"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const Menu = [
    { 
      name: "Dashboard", 
      href: "/dashboard/admin",
      match: (p: string) => p === "/dashboard/admin"
    },
    { 
      name: "Mahasiswa", 
      href: "/dashboard/admin/mahasiswa",
      match: (p: string) => p.startsWith("/dashboard/admin/mahasiswa")
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <aside className="w-64 bg-white shadow-md p-6 space-y-4">
        <h1 className="text-xl font-bold">Campus Manage</h1>

        <nav className="space-y-2">
          {Menu.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 p-3 rounded-lg transition ${
                  active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
