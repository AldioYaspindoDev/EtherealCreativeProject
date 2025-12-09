// File: PortofolioCard.js
import Image from "next/image";

export default function PortofolioCard({ item }) {
  // Pastikan item memiliki properti yang diperlukan untuk mencegah error
  const title = item.keterangan || "Judul Tidak Tersedia";

  // 1. Mengambil nilai createdAt
  const rawDate = item.createdAt;

  // 2. Memformat tanggal ke format DMY (Tanggal-Bulan-Tahun)
  let formattedDate = "Tanggal tidak ditemukan";

  if (rawDate) {
    try {
      // Buat objek Date dari string tanggal (misalnya: "2025-11-25T00:00:00.000Z")
      const dateObject = new Date(rawDate);

      // Cek apakah tanggal valid
      if (!isNaN(dateObject.getTime())) {
        // Gunakan toLocaleDateString untuk format yang sesuai dengan bahasa Indonesia (id-ID)
        formattedDate = dateObject.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long", // Menggunakan nama bulan lengkap (misal: November)
          year: "numeric",
        });
      }
    } catch (e) {
      console.error("Gagal memformat tanggal:", e);
      formattedDate = "Tanggal tidak valid";
    }
  }

  // Gunakan formattedDate sebagai nilai excerpt
  const excerpt = formattedDate;

  return (
    <div
      // Memastikan kartu mengisi tinggi kolomnya dan memiliki tampilan yang bagus
      className={`flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gray-300 transition duration-300 transform hover:-translate-y-0.5 h-full group`}
    >
      <div className="w-full relative **pt-[100%]** overflow-hidden">
        <Image
          src={item.gambar}
          alt={item.keterangan}
          height={500}
          width={500}
          // Image harus diatur sebagai 'absolute' untuk mengisi container padding-top
          className="**absolute top-0 left-0 h-full w-full** object-cover transition-transform duration-500 **group-hover:scale-110**"
        />
      </div>

      {/* Konten Teks */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Judul: Ukuran font responsif */}
        <h3 className="text-[10px] sm:text-[10px] md:text-xl font-semibold text-black mb-2 sm:mb-3 leading-snug">
          {title}
        </h3>

        {/* Deskripsi: Menampilkan Tanggal dalam format DMY */}
        <p className="text-gray-700 text-[10px] sm:text-[10px] md:text-xl  flex-grow mb-2 sm:mb-4">
          {excerpt}
        </p>
      </div>
    </div>
  );
}
