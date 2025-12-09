"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArticleForm({
  onSubmit,
  initialData,
  loading,
  pageTitle,
  buttonText,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    JudulArtikel: "",
    IsiArtikel: "",
    ImageUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        JudulArtikel: initialData.JudulArtikel || "",
        IsiArtikel: initialData.IsiArtikel || "",
        ImageUrl: initialData.ImageUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen py-10">
      {/* Header */}
      <div className="relative w-full h-48 mx-auto max-w-[1171px] mb-10">
        <img
          src="/assetgambar/imageStore.webp"
          alt="Header"
          className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg"
        />
        <div className="absolute inset-0 bg-neutral-700/20 rounded-lg backdrop-blur-sm" />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-6xl font-poppins">
          {pageTitle}
        </h1>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-[1171px] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8"
        >
          {/* Judul Artikel */}
          <div className="mb-6">
            <label
              htmlFor="JudulArtikel"
              className="block text-neutral-700 font-poppins font-medium mb-2"
            >
              Judul Artikel
            </label>
            <input
              type="text"
              id="JudulArtikel"
              name="JudulArtikel"
              value={formData.JudulArtikel}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border text-black border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Masukkan judul artikel"
            />
          </div>

          {/* Isi Artikel */}
          <div className="mb-6">
            <label
              htmlFor="IsiArtikel"
              className="block text-neutral-700 font-poppins font-medium mb-2"
            >
              Isi Artikel
            </label>
            <textarea
              id="IsiArtikel"
              name="IsiArtikel"
              value={formData.IsiArtikel}
              onChange={handleChange}
              required
              rows="8"
              className="w-full px-4 py-3 border text-black border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Masukkan isi artikel"
            />
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label
              htmlFor="ImageUrl"
              className="block text-neutral-700 font-poppins font-medium mb-2"
            >
              URL Gambar
            </label>
            <input
              type="url"
              id="ImageUrl"
              name="ImageUrl"
              value={formData.ImageUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border text-black border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="https://example.com/image.jpg"
            />
            {formData.ImageUrl && (
              <div className="mt-4">
                <p className="text-sm text-neutral-600 mb-2">Preview Gambar:</p>
                <img
                  src={formData.ImageUrl}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg border border-neutral-300"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-poppins px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : buttonText}{" "}
              {/* Gunakan prop buttonText */}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-neutral-500 text-white font-poppins px-6 py-3 rounded-lg hover:bg-neutral-600 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
