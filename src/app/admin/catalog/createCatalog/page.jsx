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
      // Get first variant data (backend creates 1 variant per catalog)
      const firstVariant = data.variants[0];

      // Create FormData with flat fields (backend format)
      const formData = new FormData();

      formData.append("productName", data.productName);
      formData.append("productDescription", data.productDescription);
      formData.append("category", data.category);

      // Variant data as flat fields
      formData.append("productPrice", firstVariant.productPrice);
      formData.append("stock", firstVariant.stock);
      formData.append("color", firstVariant.color || "");
      formData.append("sizes", JSON.stringify(firstVariant.sizes));

      // Upload images from first variant
      if (firstVariant.newImages && firstVariant.newImages.length > 0) {
        firstVariant.newImages.forEach((file) => {
          formData.append("images", file);
        });
      }

      // DEBUG: Log FormData contents
      console.log("==== DEBUG FORM DATA ====");
      for (let p of formData.entries()) {
        console.log(p[0], p[1]);
      }

      // Create catalog with first variant
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const catalogId = response.data.data.id;

      // If there are more variants, add them using addVariant endpoint
      if (data.variants.length > 1) {
        for (let i = 1; i < data.variants.length; i++) {
          const variant = data.variants[i];

          const variantFormData = new FormData();
          variantFormData.append("productPrice", variant.productPrice);
          variantFormData.append("stock", variant.stock);
          variantFormData.append("color", variant.color || "");
          variantFormData.append("sizes", JSON.stringify(variant.sizes));

          if (variant.newImages && variant.newImages.length > 0) {
            variant.newImages.forEach((file) => {
              variantFormData.append("images", file);
            });
          }

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${catalogId}/variants`,
            variantFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
        }
      }

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
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatalogForm
      onSubmit={handleSubmit}
      loading={loading}
      pageTitle="Tambah Produk Baru"
      buttonText="Simpan Catalog"
    />
  );
}
