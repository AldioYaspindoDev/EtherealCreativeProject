"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function PortofolioTable({ initialPortofolios }) {
  const [portofolios, setPortofolios] = useState(initialPortofolios);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus Portofolio ini?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/portofolio/${id}`);

      setPortofolios((prev) => prev.filter((item) => item._id !== id));
      toast.success("Berhasil menghapus portofolio");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus portofolio");
    }
  };

  const filteredPortofolios = portofolios.filter((item) =>
    item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Daftar Portofolio</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola galeri karya portofolio Anda
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Portofolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          <Link
            href="/admin/portofolio/createdPortofolio"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Tambah Portofolio
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
                Deskripsi
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPortofolios.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada portofolio ditemukan.
                </td>
              </tr>
            ) : (
              filteredPortofolios.map((portofolio, index) => (
                <tr
                  key={portofolio._id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                      <Image
                        src={portofolio.gambar}
                        alt={portofolio.keterangan || "Portofolio"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.style.display = "none"; // Hide if error
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {portofolio.keterangan}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/portofolio/${portofolio._id}`}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(portofolio._id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Total {filteredPortofolios.length} Portofolio
        </span>
      </div>
    </div>
  );
}
