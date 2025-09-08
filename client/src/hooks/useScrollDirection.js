import { useState, useEffect, useRef } from "react";

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");
  const lastScrollY = useRef(window.pageYOffset);
  const ticking = useRef(false);
  const threshold = 5;

  const updateScrollDirection = () => {
    const scrollY = window.pageYOffset;
    const diff = scrollY - lastScrollY.current;

    if (Math.abs(diff) > threshold) {
      setScrollDirection(diff > 0 ? "down" : "up");
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    }
    ticking.current = false;
  };

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollDirection;
}
