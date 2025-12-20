"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ArticleForm from "../ArticleForm";
import toast from "react-hot-toast";

export default function UpdateArticlePage() {
  const router = useRouter();
  const { id } = useParams();

  const [initialData, setInitialData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`
        );
        const data = res.data.data;
        setInitialData(data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        toast.error("Gagal mengambil data artikel.", {
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
        router.push("/admin/article");
      } finally {
        setPageLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
        formData
      );

      if (response.status === 200) {
        toast.success("Artikel berhasil diupdate!", {
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
      if (error.response) {
        toast.error(
          `Error ${error.response.status}: ${
            error.response.data?.message || "Gagal mengubah artikel"
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
        toast.error("Tidak dapat terhubung ke server.", {
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
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        Loading data artikel...
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        Data artikel tidak ditemukan.
      </div>
    );
  }

  return (
    <ArticleForm
      onSubmit={handleSubmit}
      initialData={initialData}
      loading={submitLoading}
      pageTitle="Update Artikel"
      buttonText="Update Artikel"
    />
  );
}
