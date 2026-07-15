'use client';

import { useState } from 'react';
import Image from 'next/image';

// Data warna dengan gambar dan ukuran yang tersedia
const productData = {
  black: {
    name: 'Raglan White Black',
    image: '/assetgambar/Raglan/Black.png',
    sizes: ['L']
  },
  sportgray: {
    name: 'Raglan Grey',
    image: '/assetgambar/Raglan/SportGrey.png',
    sizes: ['L']
  },
  forestgreen: {
    name: 'Raglan ForestGreen',
    image: '/assetgambar/Raglan/ForestGreen.png',
    sizes: ['L']
  },
  RoyalBlue: {
    name: 'Raglan Royal Blue',
    image: '/assetgambar/Raglan/RoyalBlue.png',
    sizes: ['L']
  },
  Navy: {
    name: 'Raglan Navy',
    image: '/assetgambar/Raglan/Navy.png',
    sizes: ['L']
  },
  Maroon: {
    name: 'Raglan Maroon',
    image: '/assetgambar/Raglan/Maroon.png',
    sizes: ['L']
  },
  Red: {
    name: 'Raglan Red',
    image: '/assetgambar/Raglan/Red.png',
    sizes: ['L']
  },
  grayblack: {
    name: 'Raglan Grey Black',
    image: '/assetgambar/Raglan/GreyBlack.png',
    sizes: ['L']
  },
  graynavy: {
    name: 'Raglan Grey Navy',
    image: '/assetgambar/Raglan/GreyNavy.png',
    sizes: ['L']
  },
  greymaroon: {
    name: 'Raglan Grey Maroon',
    image: '/assetgambar/Raglan/GreyMaroon.png',
    sizes: ['L']
  },
  greyred: {
    name: 'Raglan Grey Red',
    image: '/assetgambar/Raglan/GreyRed.png',
    sizes: ['L']
  },
};

const colors = [
    { key: 'black', class: 'bg-black' },
    { key: 'sportgray', class: 'bg-gray-700' },
    { key: 'forestgreen', class: 'bg-[#228B22]' },
    { key: 'RoyalBlue', class: 'bg-[#184783]' },
    { key: 'Navy', class: 'bg-[#181E3B]' },
    { key: 'Maroon', class: 'bg-[#411828]' },
    { key: 'Red', class: 'bg-[#801A25]' },
    { key: 'grayblack', class: 'bg-black' },
    { key: 'graynavy', class: 'bg-[#181E3B]' },
    { key: 'greymaroon', class: 'bg-[#411828]' },
    { key: 'greyred', class: 'bg-[#801A25]' },
];

export default function ProductDetailRaglan() {
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
              Raglan 24s
            </h1>
            <p className="text-black text-lg lg:text-xl font-normal font-['Poppins'] mb-4">
              Rp 67.000
            </p>

            <div className="mb-4">
              <span className="text-black text-base lg:text-lg font-semibold font-['Poppins']">
                Deskripsi:
              </span>
              <ul className="text-black text-sm lg:text-base font-normal font-['Poppins'] mt-1 ml-4 list-disc">
                <li>Cotton Combed 20s</li>
                <li>Label dapat di robek</li>
                <li>Umum di pakai brand streetwear dan merchandise </li>
                <li>Bahan lebih berstektur</li>
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
                  src="/assetgambar/Raglan/SizeRaglan.jpg"  
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
                  src="/assetgambar/Raglan/KatalogRaglan.jpg"
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