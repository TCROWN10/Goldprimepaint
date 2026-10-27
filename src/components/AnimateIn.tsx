"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type AnimateInProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay index (0-based) */
  index?: number;
  /** Animation style */
  variant?: "up" | "scale" | "fade" | "left" | "right";
  as?: ElementType;
  style?: CSSProperties;
};

export function AnimateIn({
  children,
  className = "",
  index = 0,
  variant = "up",
  as: Tag = "div",
  style,
}: AnimateInProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`card-reveal card-reveal--${variant} ${visible ? "is-visible" : ""} ${className}`}
      style={
        {
          ...style,
          "--card-stagger": `${Math.min(index, 12) * 70}ms`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
