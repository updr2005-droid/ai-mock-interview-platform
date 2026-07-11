import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <MainLayout>

      <Hero />

      <Stats />

      <HowItWorks />

      <Features />

      <Testimonials />
      <Footer />

    </MainLayout>
    
  );
}