import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Position classes for the tooltip container relative to its anchor children
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Arrow orientation classes
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-950 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-950 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-950 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-950 border-y-transparent border-l-transparent',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: position === 'top' ? 6 : position === 'bottom' ? -6 : 0, x: position === 'left' ? 6 : position === 'right' ? -6 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: position === 'top' ? 6 : position === 'bottom' ? -6 : 0, x: position === 'left' ? 6 : position === 'right' ? -6 : 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute z-50 pointer-events-none w-max max-w-[200px] sm:max-w-xs bg-slate-950 border border-slate-800 text-slate-200 text-[10px] sm:text-xs font-mono font-medium px-2.5 py-1.5 rounded-lg shadow-2xl ${positionClasses[position]}`}
          >
            {content}
            <div className={`absolute border-4 ${arrowClasses[position]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
