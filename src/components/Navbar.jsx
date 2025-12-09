"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // 🔹 Tambahan untuk deteksi halaman aktif
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // 🔹 Ambil path URL saat ini

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/catalog" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/assetgambar/MainLogo.png"
                alt="Logo Ethereal"
                width={150}
                height={40}
                priority
                className="w-[150px] h-auto"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-base lg:text-xl font-medium font-['Poppins'] transition-colors ${
                    pathname === item.href
                      ? "text-[#001E91]" // 🔵 aktif
                      : "text-black hover:text-[#001E91]" // default
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <Link
              href="/keranjang"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaShoppingCart className="text-xl sm:text-2xl text-black" />
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl text-black" />
              ) : (
                <FaBars className="text-xl text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-white transition-transform duration-300 ease-in-out z-40 p-6 md:hidden ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-end mb-8">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-xl text-black" />
            </button>
          </div>

          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMenu}
                className={`text-2xl font-medium font-['Poppins'] py-2 border-b border-gray-100 transition-colors ${
                  pathname === item.href
                    ? "text-[#001E91]" // 🔵 aktif mobile
                    : "text-black hover:text-[#001E91]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
