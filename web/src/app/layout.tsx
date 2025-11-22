import './globals.css';
import React from 'react';


export const metadata = { title: 'Campus Manage', description: 'Manajemen Mahasiswa' };


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="bg-gray-50 min-h-screen">
<div className="max-w-6xl mx-auto p-4">{children}</div>
</body>
</html>
);
}