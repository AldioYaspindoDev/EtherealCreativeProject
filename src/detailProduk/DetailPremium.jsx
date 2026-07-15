'use client';

import { useState } from 'react';

// Data warna dengan gambar dan ukuran yang tersedia
const productData = {
  black: {
    name: 'Black',
    image: 'https://placehold.co/573x728/000000/FFFFFF?text=Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  darkGray: {
    name: 'Dark Gray',
    image: 'https://placehold.co/573x728/404040/FFFFFF?text=Dark+Gray',
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  charcoal: {
    name: 'Charcoal',
    image: 'https://placehold.co/573x728/525252/FFFFFF?text=Charcoal',
    sizes: ['M', 'L', 'XL', '2XL', '3XL']
  },
  purple: {
    name: 'Purple',
    image: 'https://placehold.co/573x728/2E1065/FFFFFF?text=Purple',
    sizes: ['S', 'M', 'L', 'XL']
  },
  amber: {
    name: 'Amber',
    image: 'https://placehold.co/573x728/FBBF24/000000?text=Amber',
    sizes: ['M', 'L', 'XL', '2XL']
  },
  lightGray: {
    name: 'Light Gray',
    image: 'https://placehold.co/573x728/E5E5E5/000000?text=Light+Gray',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  slate: {
    name: 'Slate',
    image: 'https://placehold.co/573x728/94A3B8/FFFFFF?text=Slate',
    sizes: ['S', 'M', 'L', 'XL']
  },
  pink: {
    name: 'Pink',
    image: 'https://placehold.co/573x728/DB2777/FFFFFF?text=Pink',
    sizes: ['M', 'L', 'XL', '2XL', '3XL']
  },
  gray: {
    name: 'Gray',
    image: 'https://placehold.co/573x728/525252/FFFFFF?text=Gray',
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  lime: {
    name: 'Lime',
    image: 'https://placehold.co/573x728/A3E635/000000?text=Lime',
    sizes: ['M', 'L', 'XL']
  },
  stone: {
    name: 'Stone',
    image: 'https://placehold.co/573x728/D6D3D1/000000?text=Stone',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
  },
  orange: {
    name: 'Orange',
    image: 'https://placehold.co/573x728/FB923C/FFFFFF?text=Orange',
    sizes: ['M', 'L', 'XL', '2XL']
  },
  darkBrown: {
    name: 'Dark Brown',
    image: 'https://placehold.co/573x728/292524/FFFFFF?text=Dark+Brown',
    sizes: ['S', 'M', 'L', 'XL']
  },
  navy: {
    name: 'Navy',
    image: 'https://placehold.co/573x728/1E3A8A/FFFFFF?text=Navy',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  maroon: {
    name: 'Maroon',
    image: 'https://placehold.co/573x728/7F1D1D/FFFFFF?text=Maroon',
    sizes: ['M', 'L', 'XL', '2XL']
  },
  zinc: {
    name: 'Zinc',
    image: 'https://placehold.co/573x728/27272A/FFFFFF?text=Zinc',
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  darkSlate: {
    name: 'Dark Slate',
    image: 'https://placehold.co/573x728/334155/FFFFFF?text=Dark+Slate',
    sizes: ['M', 'L', 'XL']
  },
  red: {
    name: 'Red',
    image: 'https://placehold.co/573x728/F87171/FFFFFF?text=Red',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
  }
};

const colors = [
  { key: 'black', class: 'bg-black' },
  { key: 'darkGray', class: 'bg-neutral-700' },
  { key: 'charcoal', class: 'bg-neutral-600' },
  { key: 'purple', class: 'bg-violet-950' },
  { key: 'amber', class: 'bg-amber-400' },
  { key: 'lime', class: 'bg-lime-400' },
  { key: 'lightGray', class: 'bg-neutral-200' },
  { key: 'slate', class: 'bg-slate-400' },
  { key: 'pink', class: 'bg-pink-600' },
  { key: 'gray', class: 'bg-neutral-700' },
  { key: 'stone', class: 'bg-stone-300' },
  { key: 'orange', class: 'bg-orange-400' },
  { key: 'darkBrown', class: 'bg-stone-800' },
  { key: 'navy', class: 'bg-blue-900' },
  { key: 'maroon', class: 'bg-red-900' },
  { key: 'zinc', class: 'bg-zinc-800' },
  { key: 'darkSlate', class: 'bg-gray-700' },
  { key: 'red', class: 'bg-red-400' }
];

export default function ProductDetailPremium() {
  const [selectedColor, setSelectedColor] = useState('black');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const currentProduct = productData[selectedColor];
  const allSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-full rounded-xl border-[3px] border-blue-900 transition-all duration-300"
            />
            <div className="mt-6 text-center">
              <span className="text-black text-4xl font-semibold font-['Poppins']">
                {currentProduct.name}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-3xl border-[3px] border-blue-900 p-8">
            <h1 className="text-black text-3xl font-semibold font-['Poppins'] mb-4">
              Premium 24s
            </h1>
            <p className="text-black text-2xl font-normal font-['Poppins'] mb-8">
              Rp 55.000
            </p>

            <div className="mb-8">
              <span className="text-black text-2xl font-normal font-['Poppins']">
                Deskripsi :<br />
              </span>
              <span className="text-black text-2xl font-normal font-['Poppins']">
                Cotton Combed 24s<br />
                Label dapat di robek<br />
                Umum di pakai untuk event dan promosi<br />
                Bahan halus dan tebal<br />
                Di buat di Bangladesh
              </span>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <p className="text-black text-2xl font-normal font-['Poppins'] mb-4">
                34 Warna Yang Tersedia
              </p>
              <div className="grid grid-cols-6 gap-4">
                {colors.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => setSelectedColor(color.key)}
                    className={`w-16 h-16 rounded-full ${color.class} transition-all ${
                      selectedColor === color.key
                        ? 'ring-4 ring-blue-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    title={productData[color.key].name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <p className="text-black text-2xl font-normal font-['Poppins'] mb-4">
                Ukuran Yang Tersedia
              </p>
              <div className="grid grid-cols-4 gap-4">
                {allSizes.map((size) => {
                  const isAvailable = currentProduct.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold font-['Poppins'] transition-all ${
                        isAvailable
                          ? 'bg-zinc-100 text-black hover:bg-blue-100 hover:scale-105 cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 mt-8">
          <button
            onClick={() => setShowSizeGuide(true)}
            className="w-64 h-20 bg-white rounded-3xl border-[3px] border-blue-900 flex items-center justify-center text-black text-xl font-normal font-['Poppins'] hover:bg-blue-50 transition-all"
          >
            Detail Ukuran
          </button>
          <button
            onClick={() => setShowProductDetail(true)}
            className="w-64 h-20 bg-white rounded-3xl border-[3px] border-blue-900 flex items-center justify-center text-black text-xl font-normal font-['Poppins'] hover:bg-blue-50 transition-all"
          >
            Detail Produk
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold font-['Poppins']">
                  Detail Ukuran
                </h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-4xl font-bold hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <img
                src="https://placehold.co/800x600/EEE/000?text=Size+Guide+Chart"
                alt="Size Guide"
                className="w-full rounded-xl"
              />
              <p className="mt-4 text-gray-600 text-center font-['Poppins']">
                Ganti URL gambar ini dengan katalog ukuran Anda
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold font-['Poppins']">
                  Detail Produk
                </h2>
                <button
                  onClick={() => setShowProductDetail(false)}
                  className="text-4xl font-bold hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <img
                src="https://placehold.co/800x600/EEE/000?text=Product+Detail+Catalog"
                alt="Product Detail"
                className="w-full rounded-xl"
              />
              <p className="mt-4 text-gray-600 text-center font-['Poppins']">
                Ganti URL gambar ini dengan katalog detail produk Anda
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}