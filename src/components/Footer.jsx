"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Footer() {
  return (
    <footer
      className={`${poppins.className} w-full bg-stone-900 text-white pt-12 pb-6 px-4 sm:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* ==================== LOGO (Semua Ukuran) ==================== */}
        <div className="mb-8">
          <Image
            src="/assetgambar/LogoPutih.png"
            alt="Ethereal Logo"
            width={200}
            height={56}
            className="w-48 h-auto opacity-90"
            priority
          />
        </div>

        {/* ==================== MOBILE: ACCORDION STYLE (< md) ==================== */}
        <div className="md:hidden space-y-0 border-t border-gray-700">
          {/* Bagian Bantuan */}
          <details className="group border-b border-gray-700">
            <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
              <span className="text-sm font-semibold">Bantuan</span>
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-45 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </summary>
            <ul className="pb-4 space-y-3 text-xs font-medium">
              <li>
                <Link
                  href="https://maps.app.goo.gl/GvSCvt7BPZRKdq6u5"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  Lokasi
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="/HowtoOrder"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  How to Order
                </Link>
              </li>
            </ul>
          </details>

          {/* Bagian Contact Us */}
          <details className="group border-b border-gray-700">
            <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
              <span className="text-sm font-semibold">Contact Us</span>
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-45 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </summary>
            <ul className="pb-4 space-y-3 text-xs font-medium">
              <li>
                <Link
                  href="https://wa.me/6282312127724?text=Halo%20saya%20ingin%20bertanya"
                  className="text-gray-300 hover:text-blue-800 transition block "
                >
                  WhatsApp
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/ethereal_kreatif/"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.tiktok.com/@ethereal_kreatif"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  TikTok
                </Link>
              </li>
              <li>
                <Link
                  href="https://web.facebook.com/profile.php?id=100088662829585&_rdc=1&_rdr#"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  Facebook
                </Link>
              </li>
            </ul>
          </details>

          {/* Bagian Lainnya */}
          <details className="group border-b border-gray-700">
            <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
              <span className="text-sm font-semibold">Lainnya</span>
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-45 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </summary>
            <ul className="pb-4 space-y-3 text-xs font-medium">
              <li>
                <Link
                  href="/FAQ"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/portofolio"
                  className="text-gray-300 hover:text-blue-800 transition block"
                >
                  Portofolio
                </Link>
              </li>
            </ul>
          </details>
        </div>

        {/* ==================== DESKTOP: GRID LAYOUT (≥ md) ==================== */}
        <div className="hidden md:grid grid-cols-2 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-8 lg:gap-12 pb-12">
          {/* Kolom 1: Alamat */}
          <div className="col-span-2 sm:col-span-3 md:col-span-2 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm font-normal leading-relaxed text-gray-300 max-w-[250px] md:max-w-full pt-1">
              Jl. Bandar Damar No.16, Olo, Kec. Padang Bar., Kota Padang,
              Sumatera Barat 25171
            </p>
            <p className="text-xs sm:text-sm font-normal text-gray-300">
              ethereal@gmail.com
            </p>
          </div>

          {/* Kolom 2: Bantuan */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-sm font-semibold mb-3">Bantuan</h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="https://maps.app.goo.gl/GvSCvt7BPZRKdq6u5"
                  className="hover:text-blue-800 transition"
                >
                  Lokasi
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-800 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-800 transition">
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="/HowtoOrder"
                  className="hover:text-blue-800 transition"
                >
                  How to Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Contact Us */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-sm font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="https://wa.me/6282312127724?text=Halo%20saya%20ingin%20bertanya"
                  className="hover:text-blue-800 transition"
                >
                  WhatsApp
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/ethereal_kreatif/"
                  className="hover:text-blue-800 transition"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.tiktok.com/@ethereal_kreatif"
                  className="hover:text-blue-800 transition"
                >
                  TikTok
                </Link>
              </li>
              <li>
                <Link
                  href="https://web.facebook.com/profile.php?id=100088662829585&_rdc=1&_rdr#"
                  className="hover:text-blue-800 transition"
                >
                  Facebook
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Lainnya */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-sm font-semibold mb-3">Lainnya</h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/FAQ" className="hover:text-blue-800 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/portofolio"
                  className="hover:text-blue-800 transition"
                >
                  Portofolio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ==================== INFO ALAMAT (Mobile Only) ==================== */}
        <div className="md:hidden pt-6 pb-4 space-y-2 text-xs text-gray-300 border-b border-gray-700">
          <p className="leading-relaxed">
            Jl. Bandar Damar No.16, Olo, Kec. Padang Bar., Kota Padang, Sumatera
            Barat 25171
          </p>
          <p>ethereal@gmail.com</p>
        </div>

        {/* ==================== HAK CIPTA ==================== */}
        <div className="border-t border-gray-700 mt-8 pt-4">
          <p className="text-xs font-normal text-gray-400 text-center">
            Hak Cipta © 2025 Ethereal Kreatif. Hak cipta dilindungi
            undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
}
