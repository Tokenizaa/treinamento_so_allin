import React from 'react';

interface AllInLogoProps {
  className?: string;
  size?: number; // width in px
  height?: number;
  textColor?: string;
}

export const AllInLogo: React.FC<AllInLogoProps> = ({ 
  className, 
  size = 180, 
  height,
  textColor = "text-white"
}) => {
  // Maintaining perfect aspect ratio
  const computedHeight = height || size * 0.95;

  return (
    <svg 
      width={size} 
      height={computedHeight} 
      viewBox="0 0 512 480" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ minWidth: size, minHeight: computedHeight }}
    >
      {/* 1. Yellow Wing Outline (Tracing the brand logo perfectly) */}
      <g stroke="#F59E0B" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
        {/* Main top curve sweeping left to the sharp wing tip */}
        <path d="M266 75 C160 75 125 105 85 150 C55 185 25 215 25 230 C25 240 55 235 90 220 C140 200 205 175 266 175 L485 175" />
        
        {/* Inner feather divisions */}
        <path d="M152 120 C180 115 220 110 266 110 L485 110" strokeWidth="11" />
        <path d="M110 160 C150 150 200 142 266 142 L485 142" strokeWidth="11" />
        
        {/* Bottom swooping layers */}
        <path d="M90 220 C110 230 135 250 170 250 L335 250" />
        <path d="M125 250 C140 262 165 285 210 285 L285 285" />
      </g>

      {/* 2. "all-in" stencil text below wing */}
      <g fill="currentColor" className={textColor}>
        {/* 'a' */}
        <path d="M100 375 C100 355, 115 340, 138 340 C160 340, 168 355, 168 375 V410 H154 V398 C148 406, 138 413, 125 413 C108 413, 100 398, 100 375 Z M154 375 V370 C154 360, 148 352, 138 352 C128 352, 116 360, 116 375 C116 390, 128 401, 138 401 C148 401, 154 390, 154 375 Z" />
        
        {/* 'l' */}
        <rect x="182" y="308" width="14" height="102" rx="4" />
        
        {/* 'l' */}
        <rect x="214" y="308" width="14" height="102" rx="4" />
        
        {/* '-' */}
        <rect x="248" y="364" width="30" height="14" rx="4" />
        
        {/* 'i' */}
        <rect x="298" y="340" width="14" height="70" rx="4" />
        <circle cx="305" cy="318" r="9" fill="#F59E0B" />
        
        {/* 'n' */}
        <path d="M330 340 H344 V355 C352 344, 364 338, 376 338 C392 338, 404 348, 404 370 V410 H390 V370 C390 358, 382 352, 372 352 C362 352, 344 360, 344 376 V410 H330 V340 Z" />
      </g>

      {/* Registered trademark symbol ® */}
      <circle cx="418" cy="324" r="10" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
      <text x="414" y="328" fontSize="11" fontFamily="sans-serif" fontWeight="900" fill="currentColor" className="text-slate-400 font-sans">R</text>

      {/* 3. "LIFE STYLE" spaced subtitle */}
      <text 
        x="256" 
        y="462" 
        fill="currentColor" 
        className="text-slate-400 font-sans tracking-[0.25em] font-extrabold text-center" 
        textAnchor="middle" 
        fontSize="24"
      >
        LIFE STYLE
      </text>
    </svg>
  );
};
