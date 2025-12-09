"use client";
import {
  FaUser,
  FaFilePowerpoint,
  FaTshirt,
  FaThumbsUp,
  FaChevronLeft,
  FaBars,
  FaTimes,
  FaFileUpload,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("adminToken");
    router.push("/loginadmin");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-neutral-900 text-white p-3 rounded-lg shadow-lg"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaBars className="text-2xl" />
        )}
      </button>

      {/* Overlay - Only visible on mobile when menu is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-[300px] h-screen bg-neutral-900 flex flex-col
          fixed md:relative z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Logo - Fixed at top */}
        <div className="py-10 px-8 flex-shrink-0">
          <Link href="/admin">
            <img
              src="/assetgambar/LogoPutih.png"
              alt="Logo"
              className="w-56 h-10"
            />
          </Link>
        </div>

        {/* Scrollable Menu Area */}
        <div 
          className="flex-1 overflow-y-auto px-8 bg-neutral-900"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <nav className="flex flex-col gap-6 text-white text-lg font-poppins pb-6">
            <Link
              href="/admin/user"
              className={`flex items-center gap-3 transition ${
                pathname === "/admin/user"
                  ? "text-blue-400"
                  : "text-white hover:text-blue-400"
              }`}
              onClick={closeMenu}
            >
              <RiAdminFill className="text-xl" />
              <span>User Admin</span>
            </Link>

            <Link
              href="/admin/userCustomer"
              className={`flex items-center gap-3 transition ${
                pathname === "/admin/userCustomer"
                  ? "text-blue-400"
                  : "text-white hover:text-blue-400"
              }`}
              onClick={closeMenu}
            >
              <FaUser className="text-xl" />
              <span>User Customer</span>
            </Link>

            <Link
              href="/admin/catalog"
              className={`flex items-center gap-3 transition ${
                pathname === "/admin/catalog"
                  ? "text-blue-400"
                  : "text-white hover:text-blue-400"
              }`}
              onClick={closeMenu}
            >
              <FaTshirt className="text-xl" />
              <span>Katalog</span>
            </Link>

            <Link
              href="/admin/portofolio"
              className={`flex items-center gap-3 transition ${
                pathname === "/admin/portofolio"
                  ? "text-blue-400"
                  : "text-white hover:text-blue-400"
              }`}
              onClick={closeMenu}
            >
              <FaFileUpload className="text-xl" />
              <span>Portofolio</span>
            </Link>

            <Link
              href="/admin/article"
              className={`flex items-center gap-3 transition ${
                pathname === "/admin/article"
                  ? "text-blue-400"
                  : "text-white hover:text-blue-400"
              }`}
              onClick={closeMenu}
            >
              <FaFilePowerpoint className="text-xl" />
              <span>Artikel</span>
            </Link>

            <Link
              href="/admin/about"
              className={`flex items-center gap-3 transition ${
                pathname === "/admin/about"
                  ? "text-blue-400"
                  : "text-white hover:text-blue-400"
              }`}
              onClick={closeMenu}
            >
              <FaThumbsUp className="text-xl" />
              <span>Feedback</span>
            </Link>
          </nav>
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className="py-10 px-8 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#011C83] text-white text-base font-poppins px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FaChevronLeft />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}