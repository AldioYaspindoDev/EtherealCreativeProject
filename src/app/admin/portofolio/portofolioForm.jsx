"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Save, ArrowLeft, X } from "lucide-react";

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

  useEffect(() => {
    if (initialData) {
      setFormData({
        keterangan: initialData.keterangan || "",
        gambarFile: null,
        gambarUrl: initialData.gambarUrl || "",
      });
    }
  }, [initialData]);

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

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, gambarFile: null, gambarUrl: "" }));
    setPreviewUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getImageSrc = () => {
    if (formData.gambarFile) {
      return previewUrl;
    }
    if (previewUrl) {
      if (previewUrl.startsWith("http")) {
        return previewUrl;
      }
      return `${process.env.NEXT_PUBLIC_API_URL}/${previewUrl}`;
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* KETERANGAN */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Keterangan Portofolio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-800 placeholder-gray-400"
              placeholder="Contoh: Project Website E-Commerce Ethereal"
            />
          </div>

          {/* UPLOAD GAMBAR */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Gambar Portofolio <span className="text-red-500">*</span>
            </label>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 transition-colors hover:border-blue-400 bg-gray-50/50">
              {previewUrl ? (
                <div className="relative group">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    <img
                      src={getImageSrc()}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    title="Hapus Gambar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">
                      Klik tombol di bawah untuk mengganti gambar
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, JPEG (Max. 5MB)
                  </p>
                </div>
              )}

              <input
                type="file"
                id="gambarFile"
                name="gambarFile"
                accept="image/*"
                onChange={handleFileChange}
                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                  previewUrl ? "h-[calc(100%-2rem)]" : ""
                }`}
              />
            </div>
            {/* Fallback Input for replace logic if preview exists, slightly hacky visually but functional, 
                 or better yet rely on the overlay input above. 
                 The minimal approach: The file input covers the area. 
                 If preview exists, we might want a explicit "Change" button, 
                 but overlay works for now. */}
          </div>

          {/* ACTIONS */}
          <div className="pt-4 flex items-center gap-3">
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
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed ml-auto"
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
