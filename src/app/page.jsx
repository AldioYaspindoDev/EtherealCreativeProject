import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OurProductSection from "@/components/OurProduk";
import OurCollections from "@/components/OurCollection";
import PortfolioDesain from "@/components/PortofolioDesain";
import ArticleSection from "@/components/ArticleSection";
import CtaSection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

async function getArticlesForHome() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch articles");
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Gagal mendapatkan artikel dari server:", error);
    return [];
  }
}

export default async function Home() {
  const articlesData = await getArticlesForHome();

  return (
    <main>
      <Navbar />
      <HeroSection />
      <OurProductSection />
      <OurCollections />
      <PortfolioDesain />
      <ArticleSection initialData={articlesData} />
      <CtaSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
