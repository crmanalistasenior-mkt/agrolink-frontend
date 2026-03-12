

interface BoxProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const SkeletonBox = ({ width = '100%', height = '1rem', className = '' }: BoxProps) => (
  <div 
    className={`bg-white/5 rounded-lg animate-pulse ${className}`} 
    style={{ width, height }} 
  />
);

export const SkeletonCard = () => (
  <div className="glass-card-accent border border-white/5 p-0 overflow-hidden flex flex-col h-full">
    {/* Image Area */}
    <SkeletonBox height="8rem" className="rounded-b-none" />
    
    <div className="p-6 space-y-4 flex-grow">
      {/* Title */}
      <SkeletonBox width="75%" height="1.5rem" />
      
      {/* Lines */}
      <div className="space-y-2">
        <SkeletonBox width="50%" height="0.75rem" />
        <SkeletonBox width="66%" height="0.75rem" />
      </div>
    </div>

    {/* Bottom Section */}
    <div className="p-6 pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
      <SkeletonBox width="33%" height="2rem" />
      <SkeletonBox width="6rem" height="2rem" />
    </div>
  </div>
);

export const SkeletonOrderCard = () => (
  <div className="glass-card-accent border border-white/5 p-6 flex flex-col h-full space-y-6">
    {/* Row 1: Date & Status */}
    <div className="flex justify-between items-center">
      <SkeletonBox width="6rem" height="0.75rem" />
      <SkeletonBox width="4rem" height="1.25rem" />
    </div>

    {/* Row 2: Title */}
    <SkeletonBox width="50%" height="1.5rem" />

    {/* Row 3: Pills */}
    <div className="flex gap-2">
      <SkeletonBox width="5rem" height="1.75rem" />
      <SkeletonBox width="7rem" height="1.75rem" />
    </div>

    {/* Row 4: Muted Lines */}
    <div className="space-y-2">
      <SkeletonBox width="75%" height="0.75rem" />
      <SkeletonBox width="50%" height="0.75rem" />
    </div>
  </div>
);
