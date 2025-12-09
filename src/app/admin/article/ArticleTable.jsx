"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaRegTrashAlt, FaRetweet } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ArticleTable({ initialArtikels = [] }) {
  const [artikels, setArtikels] = useState(initialArtikels);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const truncateText = (text, maxLength) => {
    // 🔥 PERBAIKAN: Cek jika text adalah falsy (null, undefined, atau string kosong)
    if (!text) return "";

    // Sekarang aman untuk menggunakan .length
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("yakin ingin menghapus artikel ini ?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`);

      setArtikels((prev) => prev.filter((item) => item._id !== id));
      toast.success("artikel berhasil dihapus", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "12px 24px",
          borderRadius: "999px",
          fontSize: "14px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("terjadi kesalahan saat menghapus artikel", {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "16px 20px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(245, 87, 108, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          minWidth: "320px",
        },
      });
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-poppins">No</th>
              <th className="px-4 py-3 text-left font-poppins">Judul</th>
              <th className="px-4 py-3 text-left font-poppins">Isi</th>
              <th className="px-4 py-3 text-left font-poppins">Gambar</th>
              <th className="px-4 py-3 text-left font-poppins">Tanggal</th>
              <th className="px-4 py-3 text-center font-poppins">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {artikels.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-black">
                  Tidak ada data artikel
                </td>
              </tr>
            ) : (
              artikels.map((artikel, index) => (
                <tr
                  key={artikel._id}
                  className="text-black border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {artikel.JudulArtikel}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {truncateText(artikel.IsiArtikel, 50)}
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={artikel.ImageUrl}
                      alt={artikel.JudulArtikel}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(artikel.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/article/${artikel._id}`}
                        className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <FaRetweet />
                      </Link>

                      <button
                        onClick={() => handleDelete(artikel._id)}
                        className="flex items-center justify-center w-9 h-9 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {artikels.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-black text-sm">
            Tidak ada data artikel
          </div>
        ) : (
          artikels.map((artikel, index) => (
            <div key={artikel._id} className="bg-white shadow rounded-lg p-3">
              {/* Compact Header */}
              <div className="flex items-start gap-2 mb-2">
                <img
                  src={artikel.ImageUrl}
                  alt={artikel.JudulArtikel}
                  className="w-16 h-16 object-cover rounded border border-neutral-300 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-black line-clamp-2">
                      {artikel.JudulArtikel}
                    </h3>
                    <span className="text-xs text-neutral-500 flex-shrink-0">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    {formatDate(artikel.createdAt)}
                  </p>
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-xs text-neutral-700 mb-3 line-clamp-2">
                {truncateText(artikel.IsiArtikel, 80)}
              </p>

              {/* Compact Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/article/${artikel._id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-1.5 rounded text-xs hover:bg-blue-700 transition"
                >
                  <FaRetweet className="text-xs" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => handleDelete(artikel._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 text-white py-1.5 rounded text-xs hover:bg-red-700 transition"
                >
                  <FaRegTrashAlt className="text-xs" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
