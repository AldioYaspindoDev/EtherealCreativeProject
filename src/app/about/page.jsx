import Navbar from "@/components/Navbar";
import HeroSectionAbout from "./HeroSectionAbout";
import AboutStore from "./AboutStore";
import AboutClothes from "./AboutClothes";
import AboutJeans from "./AboutJeans";
import AboutSablon from "./AboutSablon";
import VisiMisi from "./VisiMisi";
import Feedback from "./Feedback";
import Lokasi from "./Lokasi";
import Footer from "@/components/Footer";

export default function About() {
  console.log("✅ API URL:", process.env.NEXT_PUBLIC_API_URL);
  return (
    <main>
      <Navbar />
      <HeroSectionAbout />
      <AboutStore />
      <AboutClothes />
      <AboutJeans />
      <AboutSablon />
      <VisiMisi />
      <Feedback />
      <Lokasi />
      <Footer />
    </main>
  );
}
