"use client";
import React, { useState, useEffect, use } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Plus,
  Minus,
  Package,
} from "lucide-react";
import api from "@/utils/axios";
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

  // Variant selection state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);

  const [userData, setUserData] = useState(null);

  // Get current selected variant
  const selectedVariant = product?.variants?.[selectedVariantIndex];

  // Fetch product data
  useEffect(() => {
    fetchProduct();
    fetchUser();
  }, []);

  // Update color/size when variant changes
  useEffect(() => {
    if (selectedVariant) {
      // Set color from variant's single color
      setSelectedColor(selectedVariant.color || "");
      // Set first size as default
      if (selectedVariant.sizes?.length > 0) {
        setSelectedSize(selectedVariant.sizes[0]);
      } else {
        setSelectedSize("");
      }
      setQuantity(1);
      // Note: We don't reset selectedImage here to allow image-based variant switching
    }
  }, [selectedVariantIndex, selectedVariant]);

  // Get all available colors from all variants
  const availableColors =
    product?.variants?.map((v) => v.color).filter(Boolean) || [];

  // Get ALL images from ALL variants for thumbnail display
  const getAllImages = () => {
    return (
      product?.variants?.flatMap((variant, variantIdx) =>
        (variant.productImages || []).map((img, imgIdx) => ({
          ...img,
          variantIndex: variantIdx,
          variantColor: variant.color,
          originalIndex: imgIdx,
        })),
      ) || []
    );
  };
  const allImages = getAllImages();

  // Function to select variant by color and update image to first image of that variant
  const selectVariantByColor = (color) => {
    const variantIndex = product?.variants?.findIndex((v) => v.color === color);
    if (variantIndex !== -1) {
      setSelectedVariantIndex(variantIndex);
      // Find first image index of this variant in allImages
      const firstImageIndex = allImages.findIndex(
        (img) => img.variantIndex === variantIndex,
      );
      if (firstImageIndex !== -1) {
        setSelectedImage(firstImageIndex);
      }
    }
  };

  // Function to handle image click - also selects the corresponding variant
  const handleImageClick = (imageIndex) => {
    setSelectedImage(imageIndex);
    const clickedImage = allImages[imageIndex];
    if (clickedImage && clickedImage.variantIndex !== selectedVariantIndex) {
      setSelectedVariantIndex(clickedImage.variantIndex);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customer/me`,
        { withCredentials: true },
      );
      if (res.data?.user) {
        setUserData(res.data.user);
      }
    } catch (err) {
      console.log("User not logged in or token expired");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setUserData(null);
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Validate color and size
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

    // Validate quantity
    if (quantity < 1 || quantity > selectedVariant.stock) {
      toast.error(`Jumlah harus antara 1 dan ${selectedVariant.stock}`, {
        duration: 3000,
        position: "bottom-center",
      });
      return;
    }

    try {
      setAddingToCart(true);

      // DEBUG: Log what's being sent
      console.log("=== ADD TO CART DEBUG ===");
      console.log("productId:", product._id);
      console.log("variantId:", selectedVariant._id);
      console.log("selectedColor:", selectedColor);
      console.log("selectedSize:", selectedSize);
      console.log("selectedVariant:", selectedVariant);

      // Send data including variantId
      const data = await addToCart(product._id, quantity, {
        color: selectedColor,
        size: selectedSize,
        variantId: selectedVariant._id,
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
      const response = await api.get(
        `${API_URL}/catalogs/${unwrappedParams.id}`,
      );

      if (response.data.success) {
        setProduct(response.data.data);

        // Set initial variant if exists
        if (response.data.data.variants?.length > 0) {
          const firstVariant = response.data.data.variants[0];
          // Set color from variant's single color
          if (firstVariant.color) {
            setSelectedColor(firstVariant.color);
          }
          if (firstVariant.sizes?.length > 0) {
            setSelectedSize(firstVariant.sizes[0]);
          }
        }
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
      if (quantity < selectedVariant.stock) {
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
      // Force fetch user data if not available
      let currentUser = userData;
      if (!currentUser) {
        try {
          const res = await api.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/customer/me`,
            { withCredentials: true },
          );
          if (res.data?.user) {
            currentUser = res.data.user;
            setUserData(res.data.user);
          }
        } catch (e) {
          console.log("Not logged in, proceeding as guest");
        }
      }

      // Create order with variant info
      const orderPayload = {
        userId: currentUser?._id,
        customerName: currentUser?.username || "Guest",
        customerPhone: currentUser?.nomorhp || "-",
        items: [
          {
            productId: product._id,
            variantId: selectedVariant._id,
            productName: product.productName,
            quantity: quantity,
            selectedColor: selectedColor,
            selectedSize: selectedSize,
            price: selectedVariant.productPrice,
            image:
              selectedVariant.productImages?.[selectedImage]?.url ||
              selectedVariant.productImages?.[0]?.url,
          },
        ],
        totalAmount: selectedVariant.productPrice * quantity,
        status: "pending",
      };

      await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        orderPayload,
        { withCredentials: true },
      );

      const message = `Halo, saya ${currentUser?.username || "Pelanggan"} (${
        currentUser?.nomorhp || "-"
      }).\nSaya ingin memesan:

*${product.productName}*
- Warna: ${selectedColor}
- Ukuran: ${selectedSize}
- Jumlah: ${quantity}
- Harga Satuan: ${formatPrice(selectedVariant.productPrice)}
- Total Harga: ${formatPrice(selectedVariant.productPrice * quantity)}

Apakah produk ini masih tersedia?`;

      const whatsappUrl = `https://wa.me/62895415019150?text=${encodeURIComponent(
        message,
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
        },
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

  const totalPrice = selectedVariant
    ? selectedVariant.productPrice * quantity
    : 0;

  const hasMultipleVariants = product.variants && product.variants.length > 1;

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
                  {allImages.length > 0 ? (
                    <img
                      src={allImages[selectedImage]?.url || allImages[0]?.url}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {/* Show which variant this image belongs to */}
                  {allImages[selectedImage]?.variantColor && (
                    <div className="absolute bottom-3 left-3 bg-blue-900/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {allImages[selectedImage].variantColor}
                    </div>
                  )}
                </div>

                {/* Thumbnail Slider - Shows ALL images from ALL variants */}
                {allImages.length > 1 && (
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
                        {allImages.map((img, index) => (
                          <button
                            key={`${img.variantIndex}-${img.originalIndex}`}
                            onClick={() => handleImageClick(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                              selectedImage === index
                                ? "border-blue-900 ring-2 ring-blue-500"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`${img.variantColor} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Small color indicator */}
                            {hasMultipleVariants && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] py-0.5 text-center truncate">
                                {img.variantColor}
                              </div>
                            )}
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
                )}
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
                  {selectedVariant && (
                    <p className="text-3xl font-medium text-black">
                      {formatPrice(selectedVariant.productPrice)}
                    </p>
                  )}
                </div>

                {/* Color Selection - Acts as Variant Selector */}
                {availableColors.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-blue-900">
                      Pilih Warna <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => selectVariantByColor(color)}
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
                )}

                {/* Stock Info */}
                {selectedVariant && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-black font-medium">
                      Stok tersedia: {selectedVariant.stock} pcs
                    </span>
                  </div>
                )}

                {/* Display Selected Color Info */}
                {selectedVariant?.color && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-blue-900 font-medium">
                      Warna: {selectedVariant.color}
                    </span>
                  </div>
                )}

                {/* Size Selection */}
                {selectedVariant?.sizes?.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-1">
                      Pilih Ukuran <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedVariant.sizes.map((size) => (
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
                )}

                {/* Quantity Selector */}
                {selectedVariant && (
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
                          disabled={quantity >= selectedVariant.stock}
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
                )}

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
