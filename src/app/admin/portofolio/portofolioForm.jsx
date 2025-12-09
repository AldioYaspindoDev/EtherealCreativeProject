// File: PortofolioForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortofolioForm({
  onSubmit,
  initialData,
  loading,
  pageTitle,
  buttonText,
}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    keterangan: "",
    gambarFile: null,
    gambarUrl: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  // PERBAIKAN: Gunakan initialData.gambarUrl (bukan initialData.gambar)
  useEffect(() => {
    if (initialData) {
      setFormData({
        keterangan: initialData.keterangan || "",
        gambarFile: null,
        gambarUrl: initialData.gambarUrl || "", // Diperbaiki
      });
    }
  }, [initialData]);

  // PERBAIKAN: Cleanup preview URL dengan benar
  useEffect(() => {
    let newPreviewUrl = null;

    if (formData.gambarFile) {
      newPreviewUrl = URL.createObjectURL(formData.gambarFile);
    } else if (formData.gambarUrl) {
      newPreviewUrl = formData.gambarUrl;
    }

    setPreviewUrl(newPreviewUrl);

    return () => {
      if (newPreviewUrl && formData.gambarFile) {
        URL.revokeObjectURL(newPreviewUrl);
      }
    };
  }, [formData.gambarFile, formData.gambarUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        gambarFile: file,
        gambarUrl: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // PERBAIKAN: Helper function untuk generate correct image URL
  const getImageSrc = () => {
    if (formData.gambarFile) {
      return previewUrl; // File baru yang diupload
    }

    if (previewUrl) {
      // Cek apakah URL sudah lengkap (http/https)
      if (previewUrl.startsWith("http")) {
        return previewUrl;
      }
      // Jika tidak, tambahkan base URL
      return `${process.env.NEXT_PUBLIC_API_URL}/${previewUrl}`;
    }

    return null;
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-[1171px] mx-auto bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-black mb-6">{pageTitle}</h1>

        <form onSubmit={handleSubmit}>
          {/* KETERANGAN PORTOFOLIO */}
          <label className="block mb-2 font-medium text-black">
            Keterangan Portofolio
          </label>
          <input
            type="text"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            required
            className="border w-full p-3 mb-4 rounded text-black"
            placeholder="Masukkan keterangan portofolio"
          />

          {/* UPLOAD GAMBAR */}
          <div className="mb-6">
            <label
              htmlFor="gambarFile"
              className="block font-medium mb-2 text-black"
            >
              Upload Gambar Portofolio
            </label>
            <input
              type="file"
              id="gambarFile"
              name="gambarFile"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-black border p-3 rounded-lg"
            />

            {/* ✅ PERBAIKAN: Preview dengan URL yang benar */}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-black mb-2">Preview Gambar:</p>
                <img
                  src={getImageSrc()}
                  alt="Preview"
                  className="w-48 h-48 object-cover text-black rounded-lg border border-neutral-300"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.png"; // Fallback image
                    console.error("Error loading image:", previewUrl);
                  }}
                />
              </div>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : buttonText}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
