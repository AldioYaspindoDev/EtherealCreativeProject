import React from "react";
import Link from "next/link";

export default function UnauthenticatedCart() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        {/* Icon / Illustration */}
        <div className="mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            className="mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            <circle cx="9" cy="19" r="2" />
            <circle cx="17" cy="19" r="2" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-black mb-3">
          Keranjang Masih Kosong
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Kamu harus login terlebih dahulu sebelum bisa menambahkan produk ke
          keranjang.
        </p>

        {/* Login Button */}
        <Link
          href="/login"
          className="block w-full bg-blue-900 text-white py-3 rounded-xl text-lg font-medium hover:bg-blue-800 transition-all"
        >
          Login Sekarang
        </Link>
      </div>
    </div>
  );
}
