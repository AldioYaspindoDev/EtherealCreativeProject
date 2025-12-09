"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CatalogForm from "../CatalogForm";
import toast from "react-hot-toast";

export default function CreateCatalogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      // Buat FormData baru
      const formData = new FormData();

      formData.append("productName", data.productName);
      formData.append("productPrice", data.productPrice);
      formData.append("productDescription", data.productDescription);
      formData.append("category", data.category);
      formData.append("stock", data.stock);

      formData.append("colors", JSON.stringify(data.colors));
      formData.append("sizes", JSON.stringify(data.sizes));

      // Upload file baru
      if (data.productImageFile && data.productImageFile.length > 0) {
        data.productImageFile.forEach((file) => {
          formData.append("images", file);
        });
      }

      // DEBUG: Lihat isi FormData yang BENAR
      console.log("==== DEBUG FINAL FORM DATA ====");
      for (let p of formData.entries()) {
        console.log(p[0], p[1]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Berhasil Menambahkan Data ke Katalog", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#1f2937",
          color: "white",
          padding: "12px 24px",
          borderRadius: "999px",
          fontSize: "14px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        },
      });
      router.push("/admin/catalog");
    } catch (error) {
      console.error("Upload gagal:", error);
      toast.error(
        "Gagal menambahkan catalog: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatalogForm
      onSubmit={handleSubmit}
      loading={loading}
      pageTitle="Tambah Catalog"
      buttonText="Simpan Catalog"
    />
  );
}
