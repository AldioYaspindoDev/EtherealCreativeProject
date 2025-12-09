"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaRetweet, FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CatalogTable({ initialCatalogs }) {
  const [catalogs, setCatalogs] = useState(initialCatalogs);
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus catalog ini?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`);

      setCatalogs((prev) => prev.filter((item) => item._id !== id));
      toast.success("Berhasil Menghapus Catalog", {
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
      toast.error("Terjadi Kesalahan Saat menghapus Catalog", {
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
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-poppins">No</th>
              <th className="px-4 py-3 text-left font-poppins">Nama</th>
              <th className="px-4 py-3 text-left font-poppins">Harga</th>
              <th className="px-4 py-3 text-left font-poppins">Warna</th>
              <th className="px-4 py-3 text-left font-poppins">Ukuran</th>
              <th className="px-4 py-3 text-left font-poppins">Jumlah</th>
              <th className="px-4 py-3 text-left font-poppins">Kategory</th>
              <th className="px-4 py-3 text-left font-poppins">Deskripsi</th>
              <th className="px-4 py-3 text-left font-poppins">Gambar</th>
              <th className="px-6 py-3 text-center font-poppins">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {catalogs.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-black">
                  Tidak ada data catalogs
                </td>
              </tr>
            ) : (
              catalogs.map((catalog, index) => (
                <tr
                  key={catalog._id || index}
                  className="text-black border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 font-medium">
                    {catalog.productName}
                  </td>

                  <td className="px-4 py-3">
                    {catalog.productPrice}
                  </td>

                  <td className="px-4 py-3">
                    {catalog.colors}
                  </td>

                  <td className="px-4 py-3">
                    {catalog.sizes}
                  </td>

                  <td className="px-4 py-3">
                    {catalog.stock}
                  </td>

                  <td className="px-4 py-3">
                    {catalog.category}
                  </td>

                  
                  {/* DESKRIPSI */}
                  <td className="px-4 py-3 text-sm">
                    {catalog.productDescription?.slice(0, 40)}...
                  </td>

                  {/* GAMBAR MULTIPLE PER VARIANT */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {catalog.productImages?.map((img) => (
                        <Image
                          key={img.publicId} // atau img.id
                          src={img.url}
                          width={80}
                          height={80}
                          alt={catalog.productName}
                        />
                      ))}
                    </div>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/admin/catalog/${catalog._id}`}
                        className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <FaRetweet />
                      </Link>
                      <button
                        onClick={() => handleDelete(catalog._id)}
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
    </>
  );
}
