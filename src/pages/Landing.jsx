import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import DashboardStats from "../components/DashboardStats";
import AnalysisSection from "../components/AnalysisSection";
import FAQSection from "../components/FAQSection";
import BackgroundBlobs from "../components/BackgroundBlobs";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <BackgroundBlobs />
      <Header />
      <HeroSection />
      <DashboardStats />
      <AnalysisSection />
      <FAQSection />
    </div>
  );
}
