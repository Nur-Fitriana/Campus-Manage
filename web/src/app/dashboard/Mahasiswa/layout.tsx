export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-100 p-6">
      {children}
    </section>
  );
}
