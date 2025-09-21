import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import DashboardStats from "../components/DashboardStats";
import AnalysisSection from "../components/AnalysisSection";
import AboutSection from "../components/About";
import FAQSection from "../components/FAQSection";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 overflow-hidden">
      <BackgroundBlobs />
      
      <Header />

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <DashboardStats />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <AnalysisSection />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <AboutSection />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      >
        <FAQSection />
      </motion.div>
    </div>
  );
}
