// File: UpdatePortofolioPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
// PERUBAHAN: Ganti import dari CatalogForm menjadi PortofolioForm
import PortofolioForm from "../portofolioForm";
import toast from "react-hot-toast"; // Tambahkan toast untuk notifikasi yang lebih baik

// PERUBAHAN: Ganti nama fungsi komponen
export default function UpdatePortofolioPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setPageLoading(true);
      try {
        // PERUBAHAN: Ubah endpoint API dari /catalogs menjadi /portofolio
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/portofolio/${id}`
        );
        const data = res.data.data;
        setInitialData({
          // Panggil properti yang benar dari API
          keterangan: data.keterangan, // Benar
          gambarUrl: data.gambar, // Benar
          gambarFile: null,
        });
      } catch (error) {
        console.error(error);
        router.push("/admin/portofolio"); // Arahkan ke halaman portofolio
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);

    try {
      const fd = new FormData();
      fd.append("keterangan", formData.keterangan);

      if (formData.gambarFile) {
        fd.append("gambar", formData.gambarFile);
        console.log("✅ Mengirim file baru:", formData.gambarFile.name);
      } else {
        console.log("ℹ️ Tidak ada file baru, gambar lama dipertahankan");
      }

      console.log(
        "📤 Mengirim ke:",
        `${process.env.NEXT_PUBLIC_API_URL}/portofolio/${id}`
      );

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/portofolio/${id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Portofolio berhasil diupdate!", {
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
      router.push("/admin/portofolio");
    } catch (error) {
      console.error("❌ Error detail:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Update portofolio gagal.", {
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
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        Memuat data portofolio...
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        Data portofolio tidak ditemukan.
      </div>
    );
  }

  return (
    // PERUBAHAN: Ganti komponen yang dirender
    <PortofolioForm
      onSubmit={handleSubmit}
      initialData={initialData}
      loading={submitLoading}
      pageTitle="Update Portofolio" // Sesuaikan judul
      buttonText="Update Portofolio" // Sesuaikan teks tombol
    />
  );
}
