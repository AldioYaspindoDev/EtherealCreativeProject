// File: CreatePortofolioPage.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PortofolioForm from "../portofolioForm";
import toast from "react-hot-toast";

export default function CreatePortofolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("keterangan", formData.keterangan);
      if (formData.gambarFile) {
        formDataToSend.append("gambar", formData.gambarFile);
      } // Debug: Lihat isi FormData
      console.log("FormData contents:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/portofolio`,
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      console.log("Response:", response.data);
      toast.success("Berhasil Menambahkan Data ke Portofolio", {
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
      console.error("Upload gagal:", error); // Log error response di browser console
      console.error("Error response:", error.response?.data);
      toast.error(
        "Gagal menambahkan portofolio: " +
          (error.response?.data?.message || error.message),
        {
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
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortofolioForm
      onSubmit={handleSubmit}
      initialData={null}
      loading={loading}
      pageTitle="Tambah Portofolio Baru"
      buttonText="Simpan Portofolio"
    />
  );
}
