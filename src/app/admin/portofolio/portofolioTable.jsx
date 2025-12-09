// File: PortofolioTable.jsx
"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaRetweet, FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

export default function PortofolioTable({ initialPortofolios }) {
  const [portofolios, setPortofolios] = useState(initialPortofolios); // Variabel state yang benar
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus Portofolio ini ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/portofolio/${id}`);

      // PERBAIKAN: setCatalogs -> setPortofolios
      setPortofolios((prev) => prev.filter((item) => item._id !== id));
      toast.success("Berhasil Menghapus Portofolio", {
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
      toast.error("Terjadi Kesalahan Saat menghapus Portofolio", {
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
              <th className="px-4 py-3 text-left font-poppins">Deskripsi</th>
              <th className="px-4 py-3 text-left font-poppins">Gambar</th>
              <th className="px-6 py-3 text-center font-poppins">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {portofolios.length === 0 ? ( // Sudah benar menggunakan portofolios
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-black">
                  {/* PERBAIKAN: catalogs -> portofolio */}
                  Tidak ada data portofolio
                </td>
              </tr>
            ) : (
              portofolios.map((portofolio, index) => (
                <tr
                  key={portofolio._id}
                  className="text-black border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {portofolio.keterangan}
                  </td>
                  <td className="px-4 py-3">
                    <Image
                      src={portofolio.gambar}
                      alt={portofolio.keterangan}
                      className="w-32 h-32 object-cover rounded-lg border border-neutral-300"
                      height={500}
                      width={500}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/128x128/f1f5f9/64748b?text=Error";
                      }}
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/admin/portofolio/${portofolio._id}`}
                        className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <FaRetweet />
                      </Link>
                      <button
                        onClick={() => handleDelete(portofolio._id)}
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
      <div className="md:hidden space-y-4">
        {/* PERBAIKAN: catalogs -> portofolios */}
        {portofolios.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center text-black">
            Tidak ada data portofolio
          </div>
        ) : (
          portofolios.map(
            (
              portofolio,
              index // Sudah benar menggunakan portofolios.map
            ) => (
              <div
                key={portofolio._id}
                className="bg-white shadow-md rounded-lg p-4 space-y-3"
              >
                {/* Image - Tidak ada perubahan */}
                <Image
                  src={portofolio.gambar}
                  alt={portofolio.keterangan}
                  width={500}
                  height={500}
                  className="w-full h-48 object-cover rounded-lg border border-neutral-300"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/128x128/f1f5f9/64748b?text=Error";
                  }}
                />

                {/* Info - Tidak ada perubahan */}
                <div className="space-y-2 text-black">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">
                      {portofolio.keterangan}
                    </h3>
                    <span className="text-sm text-neutral-600">
                      #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Actions - Tidak ada perubahan */}
                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/admin/portofolio/${portofolio._id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    <FaRetweet />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(portofolio._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    <FaRegTrashAlt />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </>
  );
}
