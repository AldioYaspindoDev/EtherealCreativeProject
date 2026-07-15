'use client';

import { useState } from 'react';
import Image from 'next/image';

// Data warna dengan gambar dan ukuran yang tersedia
const productData = {
  black: {
    name: 'Black',
    image: '/assetgambar/Pullover/Black.png',
    sizes: ['L']
  },
  sportgrey: {
    name: 'SportGrey',
    image: '/assetgambar/Pullover/SportGray.png',
    sizes: ['L']
  },
  white: {
    name: 'White',
    image: '/assetgambar/Pullover/White.png',
    sizes: ['L']
  },
  RoyalBlue: {
    name: 'Royal Blue',
    image: '/assetgambar/Pullover/RoyalBlue.png',
    sizes: ['L']
  },
  Red: {
    name: 'Red',
    image: '/assetgambar/Pullover/Red.png',
    sizes: ['L']
  },
  Maroon: {
    name: 'Maroon',
    image: '/assetgambar/Pullover/Maroon.png',
    sizes: ['L']
  },
  ForestGreen: {
    name: 'Forest Green',
    image: '/assetgambar/Pullover/ForestGreen.png',
    sizes: ['L']
  },
  Navy: {
    name: 'Navy',
    image: '/assetgambar/Pullover/Navy.png',
    sizes: ['L']
  },
  LightPink: {
    name: 'Light Pink',
    image: '/assetgambar/Pullover/LightPink.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  LightBlue: {
    name: 'Light Pink',
    image: '/assetgambar/Pullover/LightPink.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  Lilac: {
    name: 'Lilac',
    image: '/assetgambar/Pullover/Lilac.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  BlackCamo: {
    name: 'BlackCamo',
    image: '/assetgambar/Pullover/BlackCamo.png',
    sizes: ['L']
  },
  ForestCamo: {
    name: 'ForestCamo',
    image: '/assetgambar/Pullover/ForestCamo.png',
    sizes: ['L']
  },
  Army: {
    name: 'Army',
    image: '/assetgambar/Pullover/ForestCamo.png',
    sizes: ['L']
  },
  Gold: {
    name: 'Gold',
    image: '/assetgambar/Pullover/Gold.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
};

const colors = [
  { key: 'black', class: 'bg-black' },
  { key: 'sportgrey', class: 'bg-gray-400' },
  { key: 'white', class: 'bg-gray-100 border border-gray-300' },
  { key: 'ForestGreen', class: 'bg-[#228B22]' },
  { key: 'RoyalBlue', class: 'bg-[#184783]' },
  { key: 'Navy', class: 'bg-[#181E3B]' },
  { key: 'Maroon', class: 'bg-[#411828]' },
  { key: 'Red', class: 'bg-[#801A25]' },

  // CAMO — dibuat lebih realistis
  { key: 'ForestCamo', class: 'bg-[#6B7A46]' },
  { key: 'BlackCamo', class: 'bg-[#3A3A3A]' },
  { key: 'Army', class: 'bg-[#556B2F]' },

  { key: 'Lilac', class: 'bg-[#9D8CB6]' },
  { key: 'LightPink', class: 'bg-[#DBBEC8]' },
  { key: 'LightBlue', class: 'bg-[#A7C7E7]' },
  { key: 'Gold', class: 'bg-[#E9B22E]' },
];


export default function ProductDetailPullover() {
  const [selectedColor, setSelectedColor] = useState('black');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const currentProduct = productData[selectedColor];
  const allSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

  return (
    <div className="w-full min-h-screen bg-white py-4 px-4 lg:py-8 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Product Image */}
          <div className="relative">
            <div className="relative w-full aspect-[3/4] max-h-[600px]">
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-contain rounded-xl border-2 border-blue-900 transition-all duration-300"
                priority
              />
            </div>
            <div className="mt-3 text-center">
              <span className="text-black text-xl lg:text-2xl font-semibold font-['Poppins']">
                {currentProduct.name}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl border-2 border-blue-900 p-4 lg:p-6 overflow-y-auto max-h-[600px]">
            <h1 className="text-black text-xl lg:text-2xl font-semibold font-['Poppins'] mb-2">
              Pullover
            </h1>
            <p className="text-black text-lg lg:text-xl font-normal font-['Poppins'] mb-4">
              Rp 150.000
            </p>
            <p className="text-black text-lg lg:text-xl font-normal font-['Poppins'] mb-4">
              Special Camo Rp 160.000
            </p>

            <div className="mb-4">
              <span className="text-black text-base lg:text-lg font-semibold font-['Poppins']">
                Deskripsi:
              </span>
              <ul className="text-black text-sm lg:text-base font-normal font-['Poppins'] mt-1 ml-4 list-disc">
                <li>Label Satin</li>
                <li>Umum di pakai pada Clothing dan Merchandise </li>
                <li>Bahan Halus dan Ketebalan Sedang</li>
                <li>di buat di china</li>
              </ul>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-black text-base lg:text-lg font-semibold font-['Poppins'] mb-2">
                {colors.length} Warna Yang Tersedia
              </p>
              <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto px-5 py-2">
                {colors.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => setSelectedColor(color.key)}
                    className={`w-10 h-10 rounded-full ${color.class} transition-all ${
                      selectedColor === color.key
                        ? 'ring-2 ring-blue-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    title={productData[color.key].name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-black text-base lg:text-lg font-semibold font-['Poppins'] mb-2">
                Ukuran Yang Tersedia
              </p>
              <div className="grid grid-cols-4 gap-2">
                {allSizes.map((size) => {
                  const isAvailable = currentProduct.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      className={`h-12 rounded-lg flex items-center justify-center text-base font-bold font-['Poppins'] transition-all ${
                        isAvailable
                          ? 'bg-zinc-100 text-black hover:bg-blue-100 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-900'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
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
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => setShowSizeGuide(true)}
            className="flex-1 h-14 bg-white rounded-xl border-2 border-blue-900 flex items-center justify-center text-black text-base lg:text-lg font-normal font-['Poppins'] hover:bg-blue-50 transition-all"
          >
            Detail Ukuran
          </button>
          <button
            onClick={() => setShowProductDetail(true)}
            className="flex-1 h-14 bg-white rounded-xl border-2 border-blue-900 flex items-center justify-center text-black text-base lg:text-lg font-normal font-['Poppins'] hover:bg-blue-50 transition-all"
          >
            Detail Produk
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-black font-semibold font-['Poppins']">
                  Detail Ukuran
                </h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-3xl text-gray-400 font-bold hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/assetgambar/Pullover/SizePullover.jpg"
                  alt="Size Guide"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-black font-semibold font-['Poppins']">
                  Detail Produk
                </h2>
                <button
                  onClick={() => setShowProductDetail(false)}
                  className="text-3xl text-gray-400 font-bold hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/assetgambar/Pullover/KatalogPullover.jpg"
                  alt="Product Detail"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}