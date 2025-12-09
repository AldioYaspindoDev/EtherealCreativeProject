"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Bagaimana cara melakukan pemesanan?",
      answer:
        "Anda dapat melakukan pemesanan dengan mudah melalui website kami. Pilih produk yang diinginkan, isi formulir pemesanan, lalu klik tombol 'Pesan Sekarang'. Pesanan Anda akan langsung diteruskan ke WhatsApp kami untuk proses lebih lanjut.",
    },
    {
      question: "Sablon nya Jenis Apa ya ?",
      answer:
        "Sablon Direct to Film (DTF) adalah teknik cetak sablon modern yang mencetak desain langsung ke media film, lalu dipindahkan ke kain menggunakan panas. Keunggulannya adalah mampu menghasilkan gambar dengan detail tinggi, warna yang tajam, serta daya tahan lebih kuat dibanding sablon konvensional.",
    },
    {
      question: "Harga Sablon nya Berapa ?",
      answer: "A3 = 35k,  A4 = 30k, A5 = 25k, Logo = 15k",
    },
    {
      question: "Berapa Lama Pengerjaan Sablon Satuan ?",
      answer: "Kurang Lebih Sekitar 30 Menit",
    },
    {
      question: "Apakah disini bisa Bordir ?",
      answer: "Bisa Minimal Pemesanan Produk 6pcs",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-gray-600 text-lg">
            Temukan jawaban untuk pertanyaan Anda di sini
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all duration-300 ${
                      openIndex === index
                        ? "bg-blue-800 text-white scale-110"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Q
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 pt-1 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <FaChevronDown
                  className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pl-18">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-800">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        A
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Card */}
        <div className="bg-green-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0"></div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Masih Ada Pertanyaan?</h3>
              <p className="text-green-100 mb-4">
                Tim kami siap membantu Anda! Jangan ragu untuk menghubungi kami
                melalui WhatsApp.
              </p>
              <Link
                href="https://wa.me/6282312127724?text=Halo%20saya%20ingin%20bertanya"
                className="bg-white w-47 text-green-600 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
