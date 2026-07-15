const BackgroundBlobs = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl" />
    <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-teal-100/40 blur-3xl" />
    <div className="absolute -bottom-40 right-1/3 w-96 h-96 rounded-full bg-cyan-100/30 blur-3xl" />
  </div>
);

export default BackgroundBlobs;
