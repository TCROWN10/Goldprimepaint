export type Range = "indoor" | "outdoor";

export type PaintColour = {
  id: string;
  name: string;
  hex: string;
  family?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Listed price for a 20L tin. Other sizes scale from this. */
  price: number;
  range: Range;
  /** Where the paint can be used. Shown in both shops when both are set. */
  places?: Range[];
  category: string;
  description: string;
  shortDesc: string;
  image: string;
  images: string[];
  /** Building photo used when the visitor is browsing exterior. */
  outdoorImage?: string;
  outdoorImages?: string[];
  colours: PaintColour[];
  features?: string[];
  badge?: string;
};

export function isExteriorPhoto(src: string) {
  return src.includes("Outdoor-look-") || src.includes("Gravitex");
}

export function isInteriorPhoto(src: string) {
  const value = decodeURIComponent(src).toLowerCase();
  return (
    value.includes("satin finish") ||
    value.includes("super satin") ||
    value.includes("trowel finish")
  );
}

export function isTinPhoto(src: string) {
  return decodeURIComponent(src).toLowerCase().includes("gold prime paints-");
}

export function isProjectPhoto(src: string) {
  return isExteriorPhoto(src) || isInteriorPhoto(src) || isTinPhoto(src);
}

export function projectLabel(src: string) {
  if (isExteriorPhoto(src)) return "EXTERIOR";
  if (isInteriorPhoto(src)) return "INTERIOR";
  return "";
}

export function productImages(product: Product) {
  return [
    ...new Set(
      [
        product.image,
        ...product.images,
        product.outdoorImage ?? "",
        ...(product.outdoorImages ?? []),
      ].filter(Boolean),
    ),
  ];
}

/** The tin itself. Sample photos of finished walls stay out of this. */
export function paintImage(product: Product) {
  return productImages(product).find((src) => isTinPhoto(src)) ?? "";
}

/** Finished-wall photos for the interior or exterior sample. */
export function sampleImages(product: Product, range: Range) {
  return productImages(product).filter((src) =>
    range === "outdoor" ? isExteriorPhoto(src) : isInteriorPhoto(src),
  );
}

export type FinishSample = {
  src: string;
  product: Product;
  label: "INTERIOR" | "EXTERIOR";
};

export function finishSamples(products: Product[], range: Range): FinishSample[] {
  const samples: FinishSample[] = [];
  const seen = new Set<string>();
  for (const product of products) {
    for (const src of sampleImages(product, range)) {
      if (seen.has(src)) continue;
      seen.add(src);
      samples.push({
        src,
        product,
        label: range === "outdoor" ? "EXTERIOR" : "INTERIOR",
      });
    }
  }
  return samples;
}

export function productShots(product: Product, range: Range) {
  if (range === "outdoor" && product.outdoorImage) {
    const images =
      product.outdoorImages && product.outdoorImages.length
        ? product.outdoorImages
        : [product.outdoorImage];
    return { image: product.outdoorImage, images };
  }
  const images = (product.images.length ? product.images : [product.image]).filter(Boolean);
  return { image: product.image, images };
}

export function productFits(product: Product, range: Range) {
  const places = product.places?.length ? product.places : [product.range];
  return places.includes(range);
}

export function placeLabel(
  product: Product,
  labels: { indoor: string; outdoor: string },
) {
  const places = product.places?.length ? product.places : [product.range];
  if (places.includes("indoor") && places.includes("outdoor")) {
    return `${labels.indoor} & ${labels.outdoor}`;
  }
  return rangeLabel(places[0] ?? product.range, labels);
}

export const WHATSAPP_NUMBER = "2348050272664";
export const WHATSAPP_DISPLAY = "0805 027 2664";

export const TIN_SIZES = ["4L", "10L", "20L"] as const;

const TIN_FACTOR: Record<(typeof TIN_SIZES)[number], number> = {
  "4L": 0.28,
  "10L": 0.55,
  "20L": 1,
};

export type TinSize = { size: string; factor: number };

export function tinPrice(
  baseFor4L: number,
  size: string,
  sizes: TinSize[] = Object.entries(TIN_FACTOR).map(([tin, factor]) => ({
    size: tin,
    factor,
  })),
) {
  const factor = sizes.find((tin) => tin.size === size)?.factor ?? 1;
  return Math.round((baseFor4L * factor) / 100) * 100;
}

export function rangeLabel(
  range: Range,
  labels: { indoor: string; outdoor: string } = {
    indoor: "Indoor",
    outdoor: "Outdoor",
  },
) {
  return range === "indoor" ? labels.indoor : labels.outdoor;
}

export function formatPrice(naira: number) {
  return `₦ ${naira.toLocaleString("en-NG")}`;
}

export function findProduct(list: Product[], slug: string) {
  return list.find((p) => p.slug === slug);
}

export function buildWhatsAppUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(
  copy: { greeting: string; intro: string; closing: string },
  opts: {
    productName: string;
    range: string;
    category: string;
    colour: string;
    size: string;
    quantity: number;
    price: number;
  },
) {
  return cartOrderMessage(copy, [opts]);
}

export function cartOrderMessage(
  copy: { greeting: string; intro: string; closing: string },
  items: {
    productName: string;
    range: string;
    category: string;
    colour: string;
    size: string;
    quantity: number;
    price: number;
  }[],
) {
  const lines = items.flatMap((item, index) => [
    items.length > 1 ? `${index + 1}. ${item.productName}` : `• ${item.productName}`,
    `   ${item.range} · ${item.category}`,
    `   Colour: ${item.colour}`,
    `   Tin: ${item.size}`,
    `   Quantity: ${item.quantity}`,
    `   Price: ${formatPrice(item.price)} each`,
    `   Line total: ${formatPrice(item.price * item.quantity)}`,
    ``,
  ]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return [
    copy.greeting,
    ``,
    copy.intro,
    ``,
    ...lines,
    `Order total: ${formatPrice(total)}`,
    ``,
    copy.closing,
  ].join("\n");
}
