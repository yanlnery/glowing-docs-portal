import React from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Simplified components - no heavy animations for mobile performance
export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function AnimatedFadeIn({ children, className = "" }: AnimatedSectionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function AnimatedSlideIn({ 
  children, 
  className = "", 
}: AnimatedSectionProps & { direction?: "left" | "right" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function AnimatedStagger({ 
  children, 
  className = "",
}: Omit<AnimatedSectionProps, "delay"> & { staggerDelay?: number }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export const staggerItem = {
  hidden: { opacity: 1, y: 0 },
  visible: { 
    opacity: 1, 
    y: 0,
  }
};
