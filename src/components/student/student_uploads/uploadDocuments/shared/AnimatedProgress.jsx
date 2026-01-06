const AnimatedProgress = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
    <div
      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
      style={{ width: `${progress}%` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full animate-pulse" />
    </div>
  </div>
);

export default AnimatedProgress;

