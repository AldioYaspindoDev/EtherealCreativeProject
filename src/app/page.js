import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OurProductSection from "@/components/OurProduk";
import OurCollections from "@/components/OurCollection";
import PortfolioDesain from "@/components/PortofolioDesain";
import ArticleSection from "@/components/ArticleSection";
import CtaSection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <OurProductSection />
      <OurCollections />
      <PortfolioDesain />
      <ArticleSection />
      <CtaSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
