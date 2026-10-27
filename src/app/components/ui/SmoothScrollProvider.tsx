"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // smoothness
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease out cubic
      lerp: 0.1, // inertia (0 = instant, 1 = no movement)
      wheelMultiplier: 1, // adjust scroll speed with mouse wheel
      touchMultiplier: 2, // adjust scroll speed with touch
      infinite: false, // optional: set true if you want infinite loop scroll
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
