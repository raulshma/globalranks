import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Retro3D = ({
  children,
  className,
  depth: _depth = 10,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20; // 20 is sensitivity
    const y = (e.clientY - top - height / 2) / 20;
    setTransform(`perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-transform duration-200 ease-out transform-gpu",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
    >
      {children}
    </div>
  );
};
