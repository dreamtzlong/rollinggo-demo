import React, { useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function HorizontalScroller({ children, className, itemClassName }: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const firstChild = scrollRef.current.firstElementChild as HTMLElement;
    if (!firstChild) return;
    
    // Width including gap (offsetWidth + roughly 12px for gap-3)
    const itemWidth = firstChild.offsetWidth + 12; 
    if (itemWidth === 0) return;
    
    // Calculate which item is most visible
    const index = Math.round(scrollLeft / itemWidth);
    
    const childCount = React.Children.count(children);
    setActiveIndex(Math.min(Math.max(index, 0), childCount - 1));
  };

  const childArray = React.Children.toArray(children);

  return (
    <div className="flex flex-col gap-2 w-full max-w-full min-w-0 overflow-hidden">
      <div 
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1 scrollbar-hide w-full",
          className
        )}
        onScroll={handleScroll}
      >
        {childArray.map((child, i) => (
          <div key={i} className={cn("w-[260px] sm:w-[280px] shrink-0 snap-center h-auto flex flex-col [&>*]:flex-1", itemClassName)}>
            {child}
          </div>
        ))}
        {/* Spacer for end */}
        <div className="w-1 shrink-0" />
      </div>
      {childArray.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-1">
          {childArray.map((_, i) => (
             <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === activeIndex ? "bg-blue-600" : "bg-gray-300")} />
          ))}
        </div>
      )}
    </div>
  );
}
