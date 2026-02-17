import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Penang Pickleball Courts",
  description: "Find pickleball courts in Penang, Malaysia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="bg-emerald-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">🏓 Penang Pickleball Courts</h1>
              <p className="text-emerald-100 text-sm">Find and bookmark your favorite courts</p>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
