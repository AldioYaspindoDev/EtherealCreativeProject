"use client";

import { Poppins } from "next/font/google";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function ContactSection() {
  return (
    <section
      // Padding vertikal dan horizontal responsif, max-w-7xl ditambahkan untuk pembatasan lebar desktop
      className={`${poppins.className} w-full max-w-7xl mx-auto py-12 md:py-16 lg:py-20 px-4 sm:px-6 flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16`}
    >
      {/* ==================== Kiri: Lokasi & Kontak ==================== */}
      <div className="flex-1 space-y-4 md:space-y-6 lg:space-y-8">
        {/* Judul: Ukuran font responsif */}
        <h2 className="text-[24px] sm:text-[24px] md:text-[32px] font-medium text-black leading-tight">
          Location Ethereal Store
        </h2>

        {/* Alamat: Ukuran font responsif dan max-w dihilangkan dari alamat */}
        <p className="text-[24px] sm:text-lg md:text-[18px] font-normal text-black text-justify">
          Jl. Bandar Damar No.16, Olo, Kec. Padang Bar., Kota Padang, Sumatera
          Barat 25171
        </p>

        {/* Subjudul */}
        <h3 className="text-xl sm:text-2xl font-semibold text-black pt-4 md:pt-6">
          Contact Us
        </h3>

        {/* Tombol Kontak */}
        <div className="space-y-3 md:space-y-4">
          {/* Tombol akan mengisi lebar penuh container (w-full) dan bukan 600px kaku */}

          {/* WhatsApp */}
          <a
            href="https://wa.me/6282312127724?text=Halo%20saya%20ingin%20bertanya"
            className="flex items-center justify-between w-full bg-green-500 text-white text-lg sm:text-xl font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:brightness-90 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>WhatsApp</span>
            <FaWhatsapp className="text-2xl md:text-3xl" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/ethereal_kreatif/"
            className="flex items-center justify-between w-full bg-pink-600 text-white text-lg sm:text-xl font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:brightness-90 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Instagram</span>
            <FaInstagram className="text-2xl md:text-3xl" />
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@ethereal_kreatif"
            className="flex items-center justify-between w-full bg-gray-900 text-white text-lg sm:text-xl font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:brightness-90 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>TikTok</span>
            <SiTiktok className="text-2xl md:text-3xl" />
          </a>

          {/* Facebook */}
          <a
            href="https://web.facebook.com/profile.php?id=100088662829585&_rdc=1&_rdr#"
            className="flex items-center justify-between w-full bg-blue-600 text-white text-lg sm:text-xl font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:brightness-90 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Facebook</span>
            <FaFacebook className="text-2xl md:text-3xl" />
          </a>
        </div>
      </div>

      {/* ==================== Kanan: Google Maps ==================== */}
      <div className="flex-1 w-full lg:w-auto flex justify-center items-center mt-8 lg:mt-0">
        <div className="w-full max-w-full h-[520px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2766453284876!2d100.35626979999999!3d-0.9441378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b93691024777%3A0xf368c28305fb65e9!2sJl.%20Bandar%20Damar%20No.16%2C%20Olo%2C%20Kec.%20Padang%20Bar.%2C%20Kota%20Padang%2C%20Sumatera%20Barat%2025171!5e0!3m2!1sid!2sid!4v1760192374899!5m2!1sid!2sid"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Ethereal Store di Google Maps"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
