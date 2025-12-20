"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ArticleForm from "../ArticleForm";
import toast from "react-hot-toast";

export default function CreateArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      console.log("Sending data:", formData);
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        formData
      );

      console.log("Response:", response);

      if (response.status === 200 || response.status === 201) {
        toast.success("Artikel berhasil dibuat!", {
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
        router.push("/admin/article");
      }
    } catch (error) {
      console.error("Error lengkap:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);

      if (error.response) {
        toast.error(
          `Error ${error.response.status}: ${
            error.response.data?.message || "Gagal membuat artikel"
          }`,
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
      } else if (error.request) {
        toast.error(
          "Tidak dapat terhubung ke server. Periksa koneksi atau URL API.",
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
      } else {
        toast.error(`Error: ${error.message}`, {
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <ArticleForm
      onSubmit={handleSubmit}
      initialData={null}
      loading={loading}
      pageTitle="Buat Artikel Baru"
      buttonText="Simpan Artikel"
    />
  );
}
