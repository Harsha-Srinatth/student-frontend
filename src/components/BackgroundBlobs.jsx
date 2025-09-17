import { motion } from "framer-motion";

export default function BackgroundBlobs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
    >
      {/* Violet Blob */}
      <motion.div
        initial={{ x: -100, y: -100 }}
        animate={{ x: [0, 30, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-30 blur-3xl bg-violet-400"
      />

      {/* Cyan Blob */}
      <motion.div
        initial={{ x: 100, y: 100 }}
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl bg-cyan-400"
      />
    </div>
  );
}
