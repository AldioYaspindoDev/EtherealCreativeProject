import React from "react";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          className="mx-auto text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="9" cy="19" r="2" />
          <circle cx="17" cy="19" r="2" />
        </svg>
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
        Keranjang Masih Kosong
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6">
        Yuk, mulai belanja dan tambahkan produk ke keranjang!
      </p>
      <Link
        href="/catalog"
        className="inline-block bg-blue-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-800 transition-colors font-medium text-sm sm:text-base"
      >
        Mulai Belanja
      </Link>
    </div>
  );
}
