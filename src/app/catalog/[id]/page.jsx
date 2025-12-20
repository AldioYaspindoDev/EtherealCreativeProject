"use client";
import React, { useState, useEffect, use } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogSection from "../CatalogSection";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { addToCart, createOrder } from "./addToCartApi";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);

  // Fetch product data
  useEffect(() => {
    fetchProduct();
  }, []);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Validasi warna dan ukuran
    if (!selectedColor || !selectedSize) {
      toast.error("Silakan pilih warna dan ukuran terlebih dahulu", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "12px 24px",
          borderRadius: "16px",
          fontSize: "14px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        },
      });
      return;
    }

    // Validasi quantity
    if (quantity < 1 || quantity > product.stock) {
      toast.error(`Jumlah harus antara 1 dan ${product.stock}`, {
        duration: 3000,
        position: "bottom-center",
      });
      return;
    }

    try {
      setAddingToCart(true);

      // Kirim data lengkap termasuk warna, ukuran, dan quantity
      const data = await addToCart(product._id, quantity, {
        color: selectedColor,
        size: selectedSize,
      });
      refreshCart();

      toast.success(`${product.productName} ditambahkan ke keranjang!`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "12px 24px",
          borderRadius: "999px",
          fontSize: "14px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        },
      });
    } catch (err) {
      console.error("Error add to cart:", err);

      if (err.response?.data?.requireAuth) {
        toast.error("Silakan login terlebih dahulu", {
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
        setTimeout(() => router.push("/login"), 1000);
        return;
      }

      toast.error(`Gagal: ${err.response?.data?.message || err.message}`, {
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
    } finally {
      setAddingToCart(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(
        `${API_URL}/catalogs/${unwrappedParams.id}`
      );

      if (response.data.success) {
        setProduct(response.data.data);
        if (response.data.data.colors?.length > 0)
          setSelectedColor(response.data.data.colors[0]);
        if (response.data.data.sizes?.length > 0)
          setSelectedSize(response.data.data.sizes[0]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat produk", {
        duration: 3000,
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      if (quantity < product.stock) {
        setQuantity(quantity + 1);
      }
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  const scrollThumbnails = (direction) => {
    const container = document.getElementById("thumbnail-container");
    const scrollAmount = 100;
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
      setScrollPosition(container.scrollLeft - scrollAmount);
    } else {
      container.scrollLeft += scrollAmount;
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppOrder = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Silakan pilih warna dan ukuran terlebih dahulu", {
        duration: 3000,
        position: "bottom-center",
      });
      return;
    }

    try {
      setIsOrdering(true);

      // Create order in database first
      await createOrder(product._id, quantity, {
        color: selectedColor,
        size: selectedSize,
        customerName: "WhatsApp Guest", // Placeholder guest data
        customerPhone: "-", // Placeholder guest data
      });

      const message = `Halo, saya ingin memesan:

*${product.productName}*
- Warna: ${selectedColor}
- Ukuran: ${selectedSize}
- Jumlah: ${quantity}
- Harga Satuan: ${formatPrice(product.productPrice)}
- Total Harga: ${formatPrice(product.productPrice * quantity)}

Apakah produk ini masih tersedia?`;

      const whatsappUrl = `https://wa.me/62895415019150?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.error("Error creating order:", err);

      if (err.response?.data?.requireAuth) {
        toast.error("Silakan login terlebih dahulu", {
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
        setTimeout(() => router.push("/login"), 1000);
        return;
      }

      toast.error(
        `Gagal memproses pesanan: ${
          err.response?.data?.message || err.message
        }`,
        {
          duration: 4000,
          position: "bottom-center",
        }
      );
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Produk tidak ditemukan</p>
      </div>
    );
  }

  const totalPrice = product.productPrice * quantity;
  const primaryImage =
    product.productImages.find((img) => img.isPrimary) ||
    product.productImages[0];
  const thumbnails = product.productImages;

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="ms-40 mt-10 mx-auto">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-blue-900">
            Catalog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.productName}</span>
        </nav>
      </div>

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
              {/* LEFT SECTION - Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-blue-900">
                  <img
                    src={
                      product.productImages[selectedImage]?.url ||
                      primaryImage.url
                    }
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Slider */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollThumbnails("left")}
                      className="p-2 rounded-lg bg-white border-2 border-blue-900 hover:bg-gray-50 transition-colors z-10"
                    >
                      <ChevronLeft className="w-5 h-5 text-blue-900" />
                    </button>

                    <div
                      id="thumbnail-container"
                      className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
                      style={{ scrollBehavior: "smooth" }}
                    >
                      {thumbnails.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? "border-blue-900"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => scrollThumbnails("right")}
                      className="p-2 rounded-lg bg-white border-2 border-blue-900 hover:bg-gray-50 transition-colors z-10"
                    >
                      <ChevronRight className="w-5 h-5 text-blue-900" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION - Product Details */}
              <div className="space-y-6">
                {/* Product Name & Category */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-blue-900 font-medium">
                      Kategori {product.category}
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-black mb-3">
                    {product.productName}
                  </h1>
                  <p className="text-3xl font-medium text-black">
                    {formatPrice(product.productPrice)}
                  </p>
                </div>

                {/* Stock Info */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-black font-medium">
                    Stok tersedia: {product.stock} pcs
                  </span>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-blue-900">
                    Pilih Warna <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedColor === color
                            ? "border-blue-900 bg-blue-50 text-blue-900"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-1">
                    Pilih Ukuran <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-lg border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? "border-blue-900 bg-blue-50 text-blue-900"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="text-sm font-semibold text-blue-900 mb-3 block">
                    Jumlah
                  </label>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center border-2 border-blue-900 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className="p-3 bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-blue-800"
                      >
                        <Minus className="w-5 h-5 text-white" />
                      </button>
                      <span className="px-6 font-semibold text-lg text-blue-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        disabled={quantity >= product.stock}
                        className="p-3 bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-blue-800"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Total Harga</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || !selectedColor || !selectedSize}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Menambahkan...</span>
                      </>
                    ) : (
                      <ShoppingCart className="w-6 h-6" />
                    )}
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={!selectedColor || !selectedSize || isOrdering}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOrdering ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FaWhatsapp className="w-6 h-6" />
                    )}
                    Pesan via WhatsApp
                  </button>
                </div>

                {/* Product Description */}
                <div className="pt-6 border-2 border-blue-900 rounded-2xl py-10 px-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.productDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CatalogSection />
      <Footer />
    </>
  );
}
