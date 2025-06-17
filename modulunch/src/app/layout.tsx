import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: "ModuLunch",
  description: "Find friends to have lunch with",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-900">
        <nav className="bg-white shadow p-4 flex gap-6 items-center">
          <Link href="/" className="font-bold text-lg text-pink-600">ModuLunch</Link>
          <Link href="/dashboard" className="hover:text-pink-500">Dashboard</Link>
          <Link href="/discover" className="hover:text-pink-500">Discover</Link>
          <Link href="/schedule" className="hover:text-pink-500">Schedule</Link>
          <Link href="/profile" className="hover:text-pink-500">Profile</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}