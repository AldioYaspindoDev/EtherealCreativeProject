'use client';

import { useState } from 'react';
import Image from 'next/image';

// Data warna dengan gambar dan ukuran yang tersedia
const productData = {
  black: {
    name: 'Black',
    image: '/assetgambar/youth/Black.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  sportgrey: {
    name: 'SportGrey',
    image: '/assetgambar/youth/SportGrey.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  white: {
    name: 'White',
    image: '/assetgambar/youth/White.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  sand: {
    name: 'Sand',
    image: '/assetgambar/youth/Sand.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  ForestGreen: {
    name: 'Forest Green',
    image: '/assetgambar/youth/ForestGreen.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },

  IrishGreen: {
    name: 'Irish Green',
    image: '/assetgambar/youth/IrishGreen.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  Lime: {
    name: 'Lime',
    image: '/assetgambar/youth/Lime.png',
    sizes: ['L']
  },
  GreenAsh: {
    name: 'Green Ash',
    image: '/assetgambar/youth/GreenAsh.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  AquaSky: {
    name: 'Aqua Sky',
    image: '/assetgambar/youth/AquaSky.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  CarolinaBlue: {
    name: 'Carolina Blue',
    image: '/assetgambar/youth/CarolinaBlue.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  RoyalBlue: {
    name: 'Royal Blue',
    image: '/assetgambar/youth/RoyalBlue.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  Navy: {
    name: 'Navy',
    image: '/assetgambar/youth/Navy.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  Purple: {
    name: 'Purple',
    image: '/assetgambar/youth/Purple.png',
    sizes: ['L']
  },
  Lilac: {
    name: 'Lilac',
    image: '/assetgambar/youth/Lilac.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  LightPink: {
    name: 'Light Pink',
    image: '/assetgambar/youth/LightPink.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  Heliconia: {
    name: 'Heliconia',
    image: '/assetgambar/youth/Heliconia.png',
    sizes: ['L']
  },

  Maroon: {
    name: 'Maroon',
    image: '/assetgambar/youth/Maroon.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  Red: {
    name: 'Red',
    image: '/assetgambar/youth/Red.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  },
  Orange: {
    name: 'Orange',
    image: '/assetgambar/youth/Orange.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  Salmon: {
    name: 'Salmon',
    image: '/assetgambar/youth/Salmon.png',
    sizes: ['L']
  },
  Gold: {
    name: 'Gold',
    image: '/assetgambar/youth/Gold.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  Daisy: {
    name: 'Daisy',
    image: '/assetgambar/youth/Daisy.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  Butter: {
    name: 'Butter',
    image: '/assetgambar/youth/Butter.png',
    sizes: ['L']
  },
};

const colors = [
  { key: 'black', class: 'bg-black' },
  { key: 'sportgrey', class: 'bg-gray-400' },
  { key: 'white', class: 'bg-gray-100 border border-gray-300' },
  { key: 'sand', class: 'bg-[#C2B280]' },
  { key: 'ForestGreen', class: 'bg-[#228B22]' },
  { key: 'IrishGreen', class: 'bg-[#08A04B]' },
  { key: 'Lime', class: 'bg-[#32CD32]' },
  { key: 'GreenAsh', class: 'bg-[#A4C3A2]' },
  { key: 'AquaSky', class: 'bg-[#88B8C2]' },
  { key: 'CarolinaBlue', class: 'bg-[#56A0D3]' },
  { key: 'RoyalBlue', class: 'bg-[#184783]' },
  { key: 'Navy', class: 'bg-[#181E3B]' },
  { key: 'Purple', class: 'bg-[#362164]' },
  { key: 'Lilac', class: 'bg-[#9D8CB6]' },
  { key: 'LightPink', class: 'bg-[#DBBEC8]' },
  { key: 'Heliconia', class: 'bg-[#C34E94]' },
  { key: 'Maroon', class: 'bg-[#411828]' },
  { key: 'Red', class: 'bg-[#801A25]' },
  { key: 'Orange', class: 'bg-[#F15E29]' },
  { key: 'Salmon', class: 'bg-[#BB665B]' },
  { key: 'Gold', class: 'bg-[#E9B22E]' },
  { key: 'Daisy', class: 'bg-[#E9C91C]' },
  { key: 'Butter', class: 'bg-[#C9BC6D]' },
];

export default function ProductDetailyouth() {
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
              youth 24s
            </h1>
            <p className="text-black text-lg lg:text-xl font-normal font-['Poppins'] mb-4">
              Rp 45.000
            </p>

            <div className="mb-4">
              <span className="text-black text-base lg:text-lg font-semibold font-['Poppins']">
                Deskripsi:
              </span>
              <ul className="text-black text-sm lg:text-base font-normal font-['Poppins'] mt-1 ml-4 list-disc">
                <li>Cotton Combed 24s</li>
                <li>Label dapat di robek</li>
                <li>Umum di pakai untuk event dan promosi</li>
                <li>Bahan halus dan tebal</li>
                <li>Di buat di Bangladesh</li>
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
                  src="/assetgambar/youth/SizeYouth.jpg"
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
                  src="/assetgambar/youth/KatalogYouth.jpg"
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