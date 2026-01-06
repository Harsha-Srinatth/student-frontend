import { motion } from "framer-motion";

export default function BackgroundBlobs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
    >
      {/* Large Primary Blob */}
      <motion.div
        initial={{ x: -200, y: -200, scale: 0.8 }}
        animate={{ 
          x: [-100, 50, -50, -100], 
          y: [-100, -150, -50, -100],
          scale: [0.8, 1.1, 0.9, 0.8],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400"
      />

      {/* Large Secondary Blob */}
      <motion.div
        initial={{ x: 200, y: 200, scale: 0.9 }}
        animate={{ 
          x: [100, -30, 80, 100], 
          y: [100, 150, 50, 100],
          scale: [0.9, 0.7, 1.2, 0.9],
          rotate: [360, 270, 180, 90, 0]
        }}
        transition={{ 
          duration: 14, 
          repeat: Infinity, 
          ease: "easeInOut",
          times: [0, 0.3, 0.6, 1]
        }}
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400"
      />

      {/* Medium Accent Blob */}
      <motion.div
        initial={{ x: 0, y: 0, scale: 0.6 }}
        animate={{ 
          x: [0, 100, -80, 0], 
          y: [0, -60, 40, 0],
          scale: [0.6, 0.8, 0.5, 0.6]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-15 blur-3xl bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400"
      />

      {/* Small Floating Blobs */}
      <motion.div
        animate={{ 
          x: [0, 60, -40, 0], 
          y: [0, -80, 20, 0],
          scale: [1, 1.3, 0.8, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full opacity-25 blur-2xl bg-gradient-to-br from-emerald-400 to-teal-400"
      />

      <motion.div
        animate={{ 
          x: [0, -50, 70, 0], 
          y: [0, 60, -30, 0],
          scale: [1, 0.7, 1.4, 1]
        }}
        transition={{ 
          duration: 9, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full opacity-30 blur-2xl bg-gradient-to-br from-orange-400 to-red-400"
      />

      {/* Tiny Accent Dots */}
      <motion.div
        animate={{ 
          x: [0, 30, -20, 0], 
          y: [0, -40, 10, 0],
          opacity: [0.4, 0.8, 0.3, 0.4]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute top-3/4 right-1/3 w-16 h-16 rounded-full blur-xl bg-gradient-to-br from-violet-400 to-purple-400"
      />

      <motion.div
        animate={{ 
          x: [0, -25, 45, 0], 
          y: [0, 35, -15, 0],
          opacity: [0.3, 0.6, 0.2, 0.3]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full blur-xl bg-gradient-to-br from-pink-400 to-rose-400"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
    </div>
  );
}
