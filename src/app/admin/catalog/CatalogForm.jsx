"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Upload,
  Trash2,
  ArrowLeft,
  Save,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Default empty variant template
const createEmptyVariant = () => ({
  id: Date.now(),
  productPrice: "",
  stock: 0,
  color: "",
  sizes: [],
  sizeInput: "",
  images: [],
  previewImages: [],
  existingImages: [],
  deletedImages: [],
  isExpanded: true,
});

export default function CatalogForm({
  onSubmit,
  loading,
  pageTitle,
  buttonText,
  initialData = null,
}) {
  const router = useRouter();

  // PRODUCT LEVEL STATE
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");

  // VARIANTS STATE
  const [variants, setVariants] = useState([createEmptyVariant()]);

  // LOAD INITIAL DATA (for edit mode)
  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || "");
      setProductDescription(initialData.productDescription || "");
      setCategory(initialData.category || "");

      if (initialData.variants?.length > 0) {
        setVariants(
          initialData.variants.map((v, idx) => ({
            id: v.id || Date.now() + idx,
            productPrice: v.productPrice || "",
            stock: v.stock || 0,
            color: v.color || "",
            sizes: v.sizes || [],
            sizeInput: "",
            images: [],
            previewImages: [],
            existingImages: v.productImages || [],
            deletedImages: [],
            isExpanded: idx === 0,
          })),
        );
      }
    }
  }, [initialData]);

  // VARIANT HANDLERS
  const addVariant = () => {
    setVariants([...variants, createEmptyVariant()]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const toggleVariantExpand = (index) => {
    setVariants(
      variants.map((v, i) =>
        i === index ? { ...v, isExpanded: !v.isExpanded } : v,
      ),
    );
  };

  const updateVariant = (index, field, value) => {
    setVariants(
      variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  // IMAGE HANDLERS PER VARIANT
  const handleVariantImageUpload = (variantIndex, e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setVariants(
      variants.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              images: [...v.images, ...files],
              previewImages: [...v.previewImages, ...newPreviews],
            }
          : v,
      ),
    );
  };

  const removeNewImage = (variantIndex, imageIndex) => {
    setVariants(
      variants.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              images: v.images.filter((_, idx) => idx !== imageIndex),
              previewImages: v.previewImages.filter(
                (_, idx) => idx !== imageIndex,
              ),
            }
          : v,
      ),
    );
  };

  const removeExistingImage = (variantIndex, publicId, imageIndex) => {
    setVariants(
      variants.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              deletedImages: [...v.deletedImages, publicId],
              existingImages: v.existingImages.filter(
                (_, idx) => idx !== imageIndex,
              ),
            }
          : v,
      ),
    );
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  const addSize = (variantIndex) => {
    const variant = variants[variantIndex];
    if (variant.sizeInput.trim()) {
      // Update both sizes and sizeInput at once to avoid batch update issues
      setVariants(
        variants.map((v, i) =>
          i === variantIndex
            ? {
                ...v,
                sizes: [...v.sizes, v.sizeInput.trim()],
                sizeInput: "",
              }
            : v,
        ),
      );
    }
  };

  const removeSize = (variantIndex, sizeIndex) => {
    setVariants(
      variants.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              sizes: v.sizes.filter((_, idx) => idx !== sizeIndex),
            }
          : v,
      ),
    );
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare variants data
    const variantsData = variants.map((v) => ({
      id: v.id,
      productPrice: Number(v.productPrice),
      stock: Number(v.stock),
      color: v.color?.trim() || "",
      sizes: v.sizes.filter((s) => s.trim()),
      existingImages: v.existingImages,
      deletedImages: v.deletedImages,
      newImages: v.images,
    }));

    onSubmit({
      productName,
      productDescription,
      category,
      variants: variantsData,
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
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black"
      >
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* PRODUCT INFO CARD */}
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
                className="placeholder-gray-400 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
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
                placeholder="Contoh: Premium, Polo, Youth dll"
              />
            </div>
          </div>

          {/* VARIANTS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Varian Produk ({variants.length})
              </h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Varian
              </button>
            </div>

            {variants.map((variant, variantIndex) => (
              <div
                key={variant.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Variant Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleVariantExpand(variantIndex)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {variantIndex + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">
                        Varian {variantIndex + 1}
                        {variant.productPrice && (
                          <span className="ml-2 text-blue-600">
                            - Rp{" "}
                            {Number(variant.productPrice).toLocaleString(
                              "id-ID",
                            )}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {variant.color || "Belum ada warna"},{" "}
                        {variant.sizes.length} ukuran, Stok: {variant.stock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVariant(variantIndex);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {variant.isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Variant Content */}
                {variant.isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Price & Stock */}
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
                            value={variant.productPrice}
                            onChange={(e) =>
                              updateVariant(
                                variantIndex,
                                "productPrice",
                                e.target.value,
                              )
                            }
                            required
                            min="0"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Stok <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(variantIndex, "stock", e.target.value)
                          }
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Color - Single Input */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Warna <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(variantIndex, "color", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Contoh: Merah, Biru, Hitam"
                      />
                      <p className="text-xs text-gray-500">
                        Setiap varian memiliki 1 warna. Tambah varian baru untuk
                        warna berbeda.
                      </p>
                    </div>

                    {/* Sizes */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Ukuran Tersedia
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={variant.sizeInput}
                          onChange={(e) =>
                            updateVariant(
                              variantIndex,
                              "sizeInput",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyPress(e, () => addSize(variantIndex))
                          }
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          placeholder="Ketik ukuran lalu Enter/Tambah"
                        />
                        <button
                          type="button"
                          onClick={() => addSize(variantIndex)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          Tambah
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-8">
                        {variant.sizes.length === 0 && (
                          <span className="text-xs text-gray-400 italic">
                            Belum ada ukuran ditambahkan
                          </span>
                        )}
                        {variant.sizes.map((s, i) => (
                          <span
                            key={i}
                            className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-green-100"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => removeSize(variantIndex, i)}
                              className="hover:text-red-500 ml-1"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Images for this variant */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Gambar Varian
                      </label>

                      <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors text-center group cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleVariantImageUpload(variantIndex, e)
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-full inline-block mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Klik atau drop gambar
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Maks. 5MB per file
                        </p>
                      </div>

                      {/* Existing Images */}
                      {variant.existingImages.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Tersimpan
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {variant.existingImages.map((img, i) => (
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
                                  onClick={() =>
                                    removeExistingImage(
                                      variantIndex,
                                      img.publicId,
                                      i,
                                    )
                                  }
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Preview Images */}
                      {variant.previewImages.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Akan Diupload
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {variant.previewImages.map((src, i) => (
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
                                  onClick={() =>
                                    removeNewImage(variantIndex, i)
                                  }
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* ACTION BUTTONS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 sticky top-6">
            <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                Pastikan setiap varian memiliki harga, stok, warna, dan ukuran
                yang lengkap.
              </p>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">Ringkasan</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Total Varian: {variants.length}</p>
                <p>
                  Total Stok:{" "}
                  {variants.reduce((sum, v) => sum + Number(v.stock || 0), 0)}{" "}
                  pcs
                </p>
                <p>
                  Range Harga: Rp{" "}
                  {Math.min(
                    ...variants.map((v) => Number(v.productPrice) || 0),
                  ).toLocaleString("id-ID")}{" "}
                  -{" "}
                  {Math.max(
                    ...variants.map((v) => Number(v.productPrice) || 0),
                  ).toLocaleString("id-ID")}
                </p>
              </div>
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
              className="w-full py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
