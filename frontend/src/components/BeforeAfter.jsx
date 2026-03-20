import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

const BeforeAfter = ({ eventName }) => {
  const handleImageError = (e) => {
    const isPre = e.target.alt.includes('Pre');
    e.target.src = isPre 
      ? `https://picsum.photos/seed/${eventName || 'pre'}-fallback/800/500`
      : `https://picsum.photos/seed/${eventName || 'post'}-fallback/800/500`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-[var(--sidebar-bg)]">
      <div className="w-full max-w-[900px] aspect-[16/10] relative rounded-xl overflow-hidden border border-[var(--sidebar-border)] shadow-2xl">
        <ReactCompareSlider
          itemOne={
            <div className="relative h-full">
              <ReactCompareSliderImage 
                src="https://picsum.photos/seed/turkey-pre/800/500" 
                alt="Pre-disaster" 
                onError={handleImageError}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wider border border-white/10 z-10">
                Pre-disaster · Feb 5, 2023
              </div>
            </div>
          }
          itemTwo={
            <div className="relative h-full">
              <ReactCompareSliderImage 
                src="https://picsum.photos/seed/turkey-post/800/500" 
                alt="Post-disaster" 
                onError={handleImageError}
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wider border border-white/10 z-10">
                Post-disaster · Feb 7, 2023
              </div>
            </div>
          }
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      
      <div className="mt-8 text-center space-y-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">Drag slider to compare · AI-detected changes highlighted as overlays</p>
        <p className="text-[12px] text-[var(--text-secondary)] italic">Source: Maxar WorldView-3 · Resolution: 0.5m/px</p>
      </div>
    </div>
  );
};

export default BeforeAfter;
