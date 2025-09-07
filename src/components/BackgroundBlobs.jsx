export default function BackgroundBlobs() {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-30 blur-3xl bg-violet-400"></div>
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl bg-cyan-400"></div>
      </div>
    );
  }
  