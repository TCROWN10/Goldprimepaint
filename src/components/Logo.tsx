import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  className?: string;
  /** Larger hero/footer treatment */
  size?: "sm" | "md" | "lg" | "xl";
  /** Use link wrapper (default true) */
  asLink?: boolean;
  priority?: boolean;
  onClick?: () => void;
};

const sizes = {
  sm: "h-10 w-auto",
  md: "h-[3.25rem] w-auto md:h-16",
  lg: "h-24 w-auto md:h-28",
  xl: "h-32 w-auto md:h-36",
};

export function Logo({
  href = "/",
  className = "",
  size = "md",
  asLink = true,
  priority = false,
  onClick,
}: LogoProps) {
  const image = (
    <Image
      src="/goldprime-logo.png"
      alt="GoldPrime Paint"
      width={1282}
      height={795}
      priority={priority}
      unoptimized
      className={`${sizes[size]} ${className}`}
    />
  );

  if (!asLink) return image;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex shrink-0 transition hover:opacity-90"
    >
      {image}
    </Link>
  );
}
