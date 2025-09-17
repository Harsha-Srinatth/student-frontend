import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import DashboardStats from "../components/DashboardStats";
import AnalysisSection from "../components/AnalysisSection";
import FAQSection from "../components/FAQSection";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <BackgroundBlobs className="-z-10 absolute inset-0" />

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <HeroSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <DashboardStats />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <AnalysisSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <FAQSection />
      </motion.div>

      {/* Header at the bottom of the page, normal flow */}
      <Header />
    </div>
  );
}
