"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CatalogTable({ initialCatalogs }) {
  const [catalogs, setCatalogs] = useState(initialCatalogs);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus catalog ini?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`);

      setCatalogs((prev) => prev.filter((item) => item._id !== id));
      toast.success("Berhasil menghapus catalog");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus catalog");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper functions for variant data
  const getPriceRange = (variants) => {
    if (!variants || variants.length === 0) return { min: 0, max: 0 };
    const prices = variants.map((v) => v.productPrice || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const getTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  const getPrimaryImage = (variants) => {
    if (!variants || variants.length === 0) return null;

    // Check each variant for a primary image
    for (const variant of variants) {
      if (variant.productImages && variant.productImages.length > 0) {
        const primary = variant.productImages.find((img) => img.isPrimary);
        if (primary) return primary.url;
        // Fall back to first image of first variant
        return variant.productImages[0]?.url;
      }
    }
    return null;
  };

  const filteredCatalogs = catalogs.filter(
    (item) =>
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Daftar Produk</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola katalog produk Anda
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-black placeholder-gray-700 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <Link
            href="/admin/catalog/createCatalog"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                No
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Gambar
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama Produk
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Varian
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Stok
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCatalogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            ) : (
              filteredCatalogs.map((catalog, index) => {
                const priceRange = getPriceRange(catalog.variants);
                const totalStock = getTotalStock(catalog.variants);
                const imageUrl = getPrimaryImage(catalog.variants);

                return (
                  <tr
                    key={catalog._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={catalog.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {catalog.productName}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {catalog.productDescription?.slice(0, 50)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {catalog.category || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {catalog.variants?.length || 0} varian
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {priceRange.min === priceRange.max ? (
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(priceRange.min)}
                        </span>
                      ) : (
                        <div className="text-sm text-gray-900">
                          <span className="text-xs text-gray-500">Mulai </span>
                          <span className="font-semibold">
                            {formatPrice(priceRange.min)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {totalStock} pcs
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/catalog/${catalog._id}`}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(catalog._id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Menampilkan {filteredCatalogs.length} data
        </span>
      </div>
    </div>
  );
}
