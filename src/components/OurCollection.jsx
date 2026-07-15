"use client";

import Image from "next/image";
import Link from "next/link";

export default function OurCollections() {
  const collections = [
    {
      src: "/assetgambar/BlackDenim.webp",
      alt: "Black Namomi",
      title: "Black Namomi",
      slug: "BlackJeans",
    },
    {
      src: "/assetgambar/JeansDenim.webp",
      alt: "Blue Black",
      title: "Premium Blue Black",
      slug: "BlueBlackJeans"
    },
    {
      src: "/assetgambar/blueindigo.png",
      alt: "Blue Indigo",
      title: "Blue Indigo",
      slug: "BlueJeans"
    },
    { src: "/assetgambar/premium.webp", alt: "Premium", title: "Premium" },
    {
      src: "/assetgambar/HeavyWheight.webp",
      alt: "Heavy Weight",
      title: "Heavy Weight",
      slug: "HeavyWeight",
    },
    {
      src: "/assetgambar/LongHeavyWheight.webp",
      alt: "Long Heavy Weight",
      title: "Long Heavy Weight",
      slug: "LongHeavyWeight"
    },
    { src: "/assetgambar/Youth.webp",
      alt: "Youth", 
      title: "Youth",
      slug: "Youth",
     },
    { 
      src: "/assetgambar/Ringer.webp", 
      alt: "Ringer", 
      title: "Ringer",
      slug: "Ringer" 
    },
    { src: "/assetgambar/Raglan.webp", alt: "Raglan", title: "Raglan" },
    { src: "/assetgambar/Polo.webp",
      alt: "Polo", 
      title: "Polo",
      slug: "Polo"
    },
    { src: "/assetgambar/Crewneck.webp",
      alt: "Crewneck", 
      title: "Crewneck", 
      slug: "Crewneck"
    },
    { src: "/assetgambar/Pullover.webp", 
      alt: "Pullover", 
      title: "Pullover", 
      slug: "PullOver"
    },
    { src: "/assetgambar/Bomber.webp", 
      alt: "Bomber", 
      title: "Bomber", 
      slug: "Bomber"
    },
    {
      src: "/assetgambar/Windbreaker.webp",
      alt: "Windbreaker",
      title: "Windbreaker",
      slug: "Windbreaker"
    },
    {
      src: "/assetgambar/Coachjaket.webp",
      alt: "Coachjacket",
      title: "Coachjacket",
      slug: "CoachJaket"
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="text-center mb-8 md:mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium font-['Poppins'] text-black">
          Our Collections
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-2 sm:px-4 md:px-8">
        {collections.map((item, index) => {
          const slug = item.slug || item.title.replace(/\s+/g, "-");

          return (
            <div key={index} className="h-full">
              <Link
                href={`/DetailProduk/${slug}`}
                className="flex flex-col justify-between h-full group"
              >
                {/* KOTAK GAMBAR FIXED RATIO */}
                <div className="w-full relative aspect-[3/4]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover rounded-lg shadow-md border border-blue-900 transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 30vw, (max-width: 1024px) 30vw, 300px"
                    priority={index < 3}
                  />
                </div>

                {/* TITLE FIXED HEIGHT */}
                <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-medium text-black font-['Poppins'] text-center px-1 mt-3 h-[40px] sm:h-[50px] md:h-[60px] flex items-center justify-center">
                  {item.title}
                </h3>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
