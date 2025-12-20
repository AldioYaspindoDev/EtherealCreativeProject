"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Upload, Trash2, ArrowLeft, Save, Info } from "lucide-react";

export default function CatalogForm({
  onSubmit,
  loading,
  pageTitle,
  buttonText,
  initialData = null,
}) {
  const router = useRouter();

  // FORM STATE
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);

  // MULTIPLE IMAGES
  const [images, setImages] = useState([]); // File[] untuk upload baru
  const [previewImages, setPreviewImages] = useState([]); // URL preview untuk file baru
  const [existingImages, setExistingImages] = useState([]); // Untuk edit mode
  const [deletedImages, setDeletedImages] = useState([]); // Track gambar yang dihapus

  // COLORS & SIZES
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState("");

  // LOAD INITIAL DATA
  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || "");
      setProductPrice(initialData.productPrice || "");
      setProductDescription(initialData.productDescription || "");
      setCategory(initialData.category || "");
      setStock(initialData.stock || 0);

      if (initialData.productImages?.length > 0) {
        setExistingImages(initialData.productImages);
      }
      if (initialData.colors?.length > 0) {
        setColors(initialData.colors);
      }
      if (initialData.sizes?.length > 0) {
        setSizes(initialData.sizes);
      }
    }
  }, [initialData]);

  // IMAGE HANDLERS
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  const removeExistingImage = (publicId, index) => {
    setDeletedImages([...deletedImages, publicId]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // TAG HANDLERS (Color/Size)
  const addColor = () => {
    if (colorInput.trim()) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };
  const removeColor = (index) =>
    setColors(colors.filter((_, i) => i !== index));

  const addSize = () => {
    if (sizeInput.trim()) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };
  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      productName,
      productPrice,
      productDescription,
      category,
      stock,
      colors: colors.filter((c) => c.trim()),
      sizes: sizes.filter((s) => s.trim()),
      productImages: existingImages, // Kirim sisa gambar lama
      deletedImages, // Kirim ID gambar yang dihapus
      productImageFile: images, // Kirim file baru
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 capitalize">
          {pageTitle}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-4">
              Informasi Utama
            </h2>

            {/* Nama Produk */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="Contoh: Premium Cotton T-Shirt"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi Produk <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                placeholder="Jelaskan detail produk, bahan, dan keunggulannya..."
              />
            </div>

            {/* Harga & Stok Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Stok Global <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="Contoh: Pakaian Pria, Aksesoris"
              />
            </div>
          </div>

          {/* VARIANTS CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-4">
              Varian Produk
            </h2>

            {/* Colors */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Warna Tersedia
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, addColor)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Ketik warna lalu Enter/Tambah"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {colors.length === 0 && (
                  <span className="text-xs text-gray-400 italic">
                    Belum ada warna ditambahkan
                  </span>
                )}
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-blue-100"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="hover:text-red-500 ml-1"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Ukuran Tersedia
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, addSize)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Ketik ukuran lalu Enter/Tambah"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {sizes.length === 0 && (
                  <span className="text-xs text-gray-400 italic">
                    Belum ada ukuran ditambahkan
                  </span>
                )}
                {sizes.map((s, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-green-100"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSize(i)}
                      className="hover:text-red-500 ml-1"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Images & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* IMAGE UPLOAD CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-4">
              Media Produk
            </h2>

            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 hover:bg-gray-50 transition-colors text-center group cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full inline-block mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Klik atau drop gambar
              </p>
              <p className="text-xs text-gray-500 mt-1">Maks. 5MB per file</p>
            </div>

            {/* Existing Images Grid */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tersimpan
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {existingImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img.url}
                        alt="Existing"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.publicId, i)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Preview Images Grid */}
            {previewImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Akan Diupload
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {previewImages.map((src, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-green-200 bg-green-50"
                    >
                      <img
                        src={src}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                Pastikan data yang Anda masukkan sudah benar sebelum menyimpan.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
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

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-col  ors"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}