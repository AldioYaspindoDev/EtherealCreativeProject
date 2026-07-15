"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import CatalogForm from "../CatalogForm";
import toast from "react-hot-toast";

export default function UpdateCatalogPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [existingVariantIds, setExistingVariantIds] = useState(new Set());
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`,
        );
        const data = res.data.data;

        setInitialData({
          productName: data.productName,
          productDescription: data.productDescription,
          category: data.category,
          variants: data.variants || [],
        });

        // Simpan daftar ID varian yang benar-benar ada di database
        if (data.variants) {
          const ids = new Set(data.variants.map((v) => v.id));
          setExistingVariantIds(ids);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data.", {
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
        router.push("/admin/catalog");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);

    try {
      // Update basic catalog info first
      const basicFd = new FormData();
      basicFd.append("productName", formData.productName);
      basicFd.append("productDescription", formData.productDescription);
      basicFd.append("category", formData.category);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`,
        basicFd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      // Update each variant
      for (const variant of formData.variants) {
        // Cek apakah ID varian ini ada di daftar ID original dari database
        const isExisting = existingVariantIds.has(variant.id);

        if (isExisting) {
          // Existing variant - update it
          const variantFd = new FormData();
          variantFd.append("productPrice", variant.productPrice);
          variantFd.append("stock", variant.stock);
          variantFd.append("color", variant.color || "");
          variantFd.append("sizes", JSON.stringify(variant.sizes));

          // Handle deleted images
          if (variant.deletedImages && variant.deletedImages.length > 0) {
            variantFd.append(
              "deletedImages",
              JSON.stringify(variant.deletedImages),
            );
          }

          // Handle existing images
          if (variant.existingImages && variant.existingImages.length > 0) {
            variantFd.append(
              "existingImages",
              JSON.stringify(variant.existingImages),
            );
          }

          // Handle new images
          if (variant.newImages && variant.newImages.length > 0) {
            variant.newImages.forEach((file) => {
              variantFd.append("images", file);
            });
          }

          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}/variants/${variant.id}`,
            variantFd,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        } else {
          // New variant - add it
          const variantFd = new FormData();
          variantFd.append("productPrice", variant.productPrice);
          variantFd.append("stock", variant.stock);
          variantFd.append("color", variant.color || "");
          variantFd.append("sizes", JSON.stringify(variant.sizes));

          if (variant.newImages && variant.newImages.length > 0) {
            variant.newImages.forEach((file) => {
              variantFd.append("images", file);
            });
          }

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}/variants`,
            variantFd,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        }
      }

      console.log("UPDATE OK");

      toast.success("Catalog berhasil diupdate!", {
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
      console.error("Gagal update - Detail Error:", error.response?.data || error.message);
      const serverMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error("Update gagal: " + serverMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        Memuat data catalog...
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-black">
        Data catalog tidak ditemukan.
      </div>
    );
  }

  return (
    <CatalogForm
      onSubmit={handleSubmit}
      initialData={initialData}
      loading={submitLoading}
      pageTitle="Edit Produk"
      buttonText="Update Catalog"
    />
  );
}
