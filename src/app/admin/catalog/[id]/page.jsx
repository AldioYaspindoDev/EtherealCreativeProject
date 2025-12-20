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
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`
        );
        const data = res.data.data;
        setInitialData({
          productName: data.productName,
          productPrice: data.productPrice,
          colors: data.colors,
          sizes: data.sizes,
          productDescription: data.productDescription,
          stock: data.stock,
          category: data.category,
          productImages: data.productImages,
          productImageFile: null,
        });
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
      const fd = new FormData();

      fd.append("productName", formData.productName);
      fd.append("productPrice", formData.productPrice);
      fd.append("productDescription", formData.productDescription);
      fd.append("category", formData.category);
      fd.append("stock", formData.stock);

      // REQUIRED fields
      fd.append("colors", JSON.stringify(formData.colors));
      fd.append("sizes", JSON.stringify(formData.sizes));

      // existing images (wajib dikirim)
      fd.append("existingImages", JSON.stringify(formData.productImages || []));

      // Upload gambar baru (multiple)
      if (formData.productImageFile) {
        if (Array.isArray(formData.productImageFile)) {
          formData.productImageFile.forEach((file) => {
            fd.append("images", file);
          });
        } else {
          fd.append("images", formData.productImageFile);
        }
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("UPDATE OK:", response.data);

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
      console.error("Gagal update:", error.response?.data || error);
      toast.error("Update gagal.");
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
