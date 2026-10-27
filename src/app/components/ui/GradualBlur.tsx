import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useMemo,
  PropsWithChildren
} from "react";

type GradualBlurProps = PropsWithChildren<{
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
  target?: "parent" | "page";
  className?: string;
  style?: CSSProperties;
}>;

const GradualBlur: React.FC<GradualBlurProps> = ({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  zIndex = 1000,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  opacity = 1,
  curve = "linear",
  target = "page",
  className = "",
  style = {},
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(animated !== "scroll");

  useEffect(() => {
    if (animated !== "scroll" || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(document.body);
    return () => observer.disconnect();
  }, [animated]);

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / divCount;

    const curveFunctions = {
      linear: (p: number) => p,
      bezier: (p: number) => p * p * (3 - 2 * p),
      "ease-in": (p: number) => p * p,
      "ease-out": (p: number) => 1 - Math.pow(1 - p, 2),
      "ease-in-out": (p: number) =>
        p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    };

    const curveFunc = curveFunctions[curve];

    const directions: Record<string, string> = {
      top: "to top",
      bottom: "to bottom",
      left: "to left",
      right: "to right"
    };

    const direction = directions[position];

    for (let i = 1; i <= divCount; i++) {
      const progress = curveFunc(i / divCount);

      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const divStyle: CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity,
        willChange: "backdrop-filter",
        transform: "translateZ(0)",
        transition:
          animated && animated !== "scroll"
            ? `backdrop-filter ${duration} ${easing}`
            : undefined
      };

      divs.push(
        <div key={i} className="absolute w-full h-full" style={divStyle} />
      );
    }

    return divs;
  }, [
    position,
    strength,
    divCount,
    exponential,
    opacity,
    curve,
    animated,
    duration,
    easing
  ]);

  const containerStyle: CSSProperties = useMemo(() => {
    const isVertical = position === "top" || position === "bottom";

    const base: CSSProperties = {
      position: "fixed",
      pointerEvents: "none",
      opacity: isVisible ? 1 : 0,
      transition: animated
        ? `opacity ${duration} ${easing}`
        : undefined,
      zIndex,
      ...style
    };

    if (isVertical) {
      base.height = height;
      base.width = width || "100vw";
      base[position] = 0;
      base.left = 0;
    } else {
      base.width = width || height;
      base.height = "100vh";
      base[position] = 0;
      base.top = 0;
    }

    return base;
  }, [
    position,
    height,
    width,
    isVisible,
    animated,
    duration,
    easing,
    zIndex,
    style
  ]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur isolate ${className}`}
      style={containerStyle}
    >
      <div className="relative w-full h-full">{blurDivs}</div>
      {children && <div className="relative">{children}</div>}
    </div>
  );
};

export default React.memo(GradualBlur);
