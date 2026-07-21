import React, { useState, useRef } from 'react';

export default function SwipeableCards({ items, renderCard, desktopContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    if (index !== activeIndex) setActiveIndex(index);
  }

  return (
    <>
      {/* Mobile: swipeable card carousel */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-1"
        >
          {items.map((item, i) => (
            <div key={i} className="snap-start shrink-0 w-full">
              <div className="glass rounded-2xl p-4">
                {renderCard(item, i)}
              </div>
            </div>
          ))}
        </div>
        {items.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === activeIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Desktop: original layout */}
      <div className="hidden md:block">
        {desktopContent}
      </div>
    </>
  );
}