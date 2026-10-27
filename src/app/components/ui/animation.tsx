// src/app/components/ui/animation.tsx
import { Variants, Transition } from "framer-motion";

const transition: Transition = { 
  duration: 0.9,  // same as enter
  ease: [0.5, 1, 0.8, 1] 
};

export const translate: Variants = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  enter: (delay: number = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      ...transition,
      delay: delay,
    },
  }),
  exit: (delay: number = 0) => ({
    y: "100%", // keep it going down
    opacity: 0,
    transition: {
      ...transition, // same duration & easing as enter
      delay: delay,
    },
  }),
};
