"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Upload, Trash2 } from "lucide-react";

export default function CatalogForm({ 
  onSubmit, 
  loading, 
  pageTitle, 
  buttonText,
  initialData = null // Untuk mode edit
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
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Untuk edit mode
  const [deletedImages, setDeletedImages] = useState([]); // Track gambar yang dihapus

  // COLORS (Array of strings)
  const [colors, setColors] = useState([""]);
  const [colorInput, setColorInput] = useState("");

  // SIZES (Array of strings)
  const [sizes, setSizes] = useState([""]);
  const [sizeInput, setSizeInput] = useState("");

  // ------------------------------
  // LOAD INITIAL DATA (untuk Edit)
  // ------------------------------
  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || "");
      setProductPrice(initialData.productPrice || "");
      setProductDescription(initialData.productDescription || "");
      setCategory(initialData.category || "");
      setStock(initialData.stock || 0);
      
      // Load existing images
      if (initialData.productImages?.length > 0) {
        setExistingImages(initialData.productImages);
      }

      // Load colors
      if (initialData.colors?.length > 0) {
        setColors(initialData.colors);
      }

      // Load sizes
      if (initialData.sizes?.length > 0) {
        setSizes(initialData.sizes);
      }
    }
  }, [initialData]);

  // ------------------------------
  // HANDLE MULTIPLE IMAGE UPLOAD
  // ------------------------------
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  // REMOVE NEW IMAGE (belum diupload)
  const removeNewImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  // REMOVE EXISTING IMAGE (untuk edit mode)
  const removeExistingImage = (publicId, index) => {
    setDeletedImages([...deletedImages, publicId]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // ------------------------------
  // HANDLE COLORS
  // ------------------------------
  const addColor = () => {
    if (colorInput.trim()) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleColorKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addColor();
    }
  };

  // ------------------------------
  // HANDLE SIZES
  // ------------------------------
  const addSize = () => {
    if (sizeInput.trim()) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSize();
    }
  };

  // ------------------------------
  // SUBMIT
  // ------------------------------
const handleSubmit = (e) => {
  e.preventDefault();

  onSubmit({
    productName,
    productPrice,
    productDescription,
    category,
    stock,
    colors: colors.filter(c => c.trim()),
    sizes: sizes.filter(s => s.trim()),
    productImages: existingImages,
    deletedImages,
    productImageFile: images, 
  });
};


  return (
    <div className="min-h-screen py-10 text-black bg-gray-50">
      <div className="max-w-[1000px] mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PRODUCT NAME */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Premium Cotton T-Shirt"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Harga Produk (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="150000"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Kategori
            </label>
            <input
              type="text"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Pakaian, Elektronik, dll"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Stok Global <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Deskripsi Produk <span className="text-red-500">*</span>
            </label>
            <textarea
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="Jelaskan detail produk, bahan, ukuran, dll..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* COLORS */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Warna <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                className="border border-gray-300 p-3 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Hitam, Putih, Navy"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyPress={handleColorKeyPress}
              />
              <button
                type="button"
                onClick={addColor}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Tambah
              </button>
            </div>
            
            {/* Color Tags */}
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                color.trim() && (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 border border-blue-300"
                  >
                    <span className="font-medium">{color}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Ukuran <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                className="border border-gray-300 p-3 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: S, M, L, XL"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={handleSizeKeyPress}
              />
              <button
                type="button"
                onClick={addSize}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Tambah
              </button>
            </div>
            
            {/* Size Tags */}
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                size.trim() && (
                  <div
                    key={index}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center gap-2 border border-green-300"
                  >
                    <span className="font-medium">{size}</span>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="hover:bg-green-200 rounded-full p-1 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Gambar Produk (Max 10) <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <Upload className="mx-auto mb-3 text-gray-400" size={48} />
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Klik untuk upload gambar
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Format: JPG, PNG, GIF, WEBP (Max 5MB per file)
              </p>
            </div>

            {/* EXISTING IMAGES (Edit Mode) */}
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Gambar Saat Ini:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        className="h-32 w-full object-cover rounded-lg border-2 border-gray-200"
                        alt={`Existing ${index + 1}`}
                      />
                      {img.isPrimary && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.publicId, index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW PREVIEW IMAGES */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Gambar Baru:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        className="h-32 w-full object-cover rounded-lg border-2 border-green-400"
                        alt={`Preview ${index + 1}`}
                      />
                      {index === 0 && !initialData && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
            >
              {loading ? "Menyimpan..." : buttonText}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}