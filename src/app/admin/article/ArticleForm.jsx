"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";

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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 capitalize">
          {pageTitle?.toLowerCase() || "Artikel"}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Inputs */}
            <div className="space-y-6">
              {/* Judul Artikel */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="JudulArtikel"
                  value={formData.JudulArtikel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-800 placeholder-gray-400"
                  placeholder="Masukkan judul artikel"
                />
              </div>

              {/* Isi Artikel */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Isi Artikel <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="IsiArtikel"
                  value={formData.IsiArtikel}
                  onChange={handleChange}
                  required
                  rows="10"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-800 placeholder-gray-400 resize-none"
                  placeholder="Tulis konten artikel di sini..."
                />
              </div>

              {/* Image URL Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  URL Gambar <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="ImageUrl"
                  value={formData.ImageUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-800 placeholder-gray-400 text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Masukkan URL gambar langsung (direct link)
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Preview */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preview Gambar
              </label>
              <div className="aspect-video w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {formData.ImageUrl ? (
                  <img
                    src={formData.ImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.classList.add("bg-red-50");
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span className="text-xs">Preview akan muncul di sini</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{buttonText}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
