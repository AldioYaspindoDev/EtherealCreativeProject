import PortofolioSection from "./portofolioSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getPortofolios() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portofolio`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch portofolio");
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Gagal mendapatkan portofolio dari server:", error);
    return [];
  }
}

export default async function PortofolioPage() {
  const initialData = await getPortofolios();

  return (
    <main>
      <Navbar />
      <PortofolioSection initialData={initialData} />
      <Footer />
    </main>
  );
}
