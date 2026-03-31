const Bone = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

const LoadingSkeleton = ({ rows = 4, variant = 'default' }) => {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Bone className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-3/4" />
                <Bone className="h-3 w-1/2" />
              </div>
            </div>
            <Bone className="h-20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-2">
        <Bone className="h-10 w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <Bone key={i} className="h-12 w-full opacity-70" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3">
        <Bone className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Bone className="h-5 w-2/3" />
          <Bone className="h-3 w-1/3" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Bone className={`h-4 ${i % 2 === 0 ? 'w-full' : 'w-5/6'}`} />
          <Bone className={`h-3 ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'}`} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
