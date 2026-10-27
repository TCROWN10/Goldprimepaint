import type { PaintColour, Product } from "@/lib/data";

function shades(family: string, pairs: [string, string, string?][]): PaintColour[] {
  return pairs.map(([name, hex, id]) => ({
    id:
      id ??
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    name,
    hex,
    family,
  }));
}

const groups: PaintColour[][] = [
  shades("Shades of Grey", [
    ["Light Grey", "#cdcecf"],
    ["Silver Grey", "#b1b5b8"],
    ["Ash Grey", "#a6aaac"],
    ["Pearl Grey", "#929699"],
    ["Smoke Grey", "#868b8e"],
    ["Dove Grey", "#919598"],
    ["Cloud Grey", "#afb5b9"],
    ["Steel Grey", "#8b949b"],
    ["Slate Grey", "#838a8f"],
    ["Graphite Grey", "#63686b"],
    ["Charcoal Grey", "#484d50"],
    ["Elephant Grey", "#4f5457"],
    ["Mist Grey", "#b6bbbe"],
    ["Fog Grey", "#a4aab0"],
    ["Stone Grey", "#868c92"],
    ["Shadow Grey", "#5c6266"],
    ["Iron Grey", "#4b5154"],
    ["Onyx Grey", "#383d40"],
  ]),
  shades("Shades of Brown", [
    ["Ivory Brown", "#e9d4b3"],
    ["Sand Brown", "#d4b689"],
    ["Beige Brown", "#d1ac7d"],
    ["Caramel", "#c99759"],
    ["Taupe", "#a58973"],
    ["Light Brown", "#a77341"],
    ["Honey Brown", "#ba8a52"],
    ["Almond Brown", "#af804c"],
    ["Hazelnut", "#985c28"],
    ["Chestnut", "#8c5224"],
    ["Cocoa Brown", "#704324"],
    ["Mocha", "#764a2c"],
    ["Terracotta", "#b9662e"],
    ["Maple Brown", "#9e5f29"],
    ["Walnut Brown", "#723f1e"],
    ["Chocolate", "#4a291a"],
    ["Dark Brown", "#412619"],
    ["Espresso", "#3b2317"],
  ]),
  shades("Whites & Off Whites", [
    ["Pure White", "#fcfbf6"],
    ["Snow White", "#faf9f4"],
    ["Pearl White", "#f0ebde"],
    ["Ivory", "#f0e7d5"],
    ["Cream", "#ece2c8"],
    ["Bone", "#ece1c9"],
    ["Shell White", "#f0eee1"],
    ["Eggshell", "#edecde"],
    ["Lily White", "#efeee1"],
    ["Cotton", "#f1ebdd"],
    ["Linen", "#edeadb"],
    ["Oyster White", "#e9e6d9"],
  ]),
  shades("Blues", [
    ["Baby Blue", "#a5d4f5"],
    ["Sky Blue", "#93c3e7"],
    ["Powder Blue", "#8bbde3"],
    ["Ocean Blue", "#6193c2"],
    ["Sapphire", "#3467a0"],
    ["Royal Blue", "#0f458d"],
    ["Slate Blue", "#658ba8"],
    ["Denim Blue", "#436381"],
    ["Navy Blue", "#15375b"],
    ["Cobalt Blue", "#022b5c"],
    ["Teal Blue", "#024c6d"],
    ["Midnight Blue", "#022043"],
  ]),
  shades("Greens", [
    ["Mint Green", "#9fe3bf"],
    ["Seafoam", "#8dd1ac"],
    ["Sage Green", "#89bf93"],
    ["Pastel Green", "#9dbf8b"],
    ["Olive Green", "#748853"],
    ["Moss Green", "#6a7f48"],
    ["Emerald Green", "#027054"],
    ["Forest Green", "#01543b"],
    ["Hunter Green", "#014c36"],
    ["Pine Green", "#014c35"],
    ["Bottle Green", "#02432c"],
    ["Dark Green", "#024028"],
  ]),
  shades("Beiges & Neutrals", [
    ["Light Beige", "#e0d0b9"],
    ["Warm Beige", "#dbc8a8"],
    ["Natural Beige", "#d5be9d"],
    ["Sand Beige", "#cbb695"],
    ["Greige", "#b8ab96"],
    ["Stone", "#b7ab96"],
    ["Latte", "#d2b999"],
    ["Cappuccino", "#cbaa81"],
    ["Tan", "#cba87a"],
    ["Fawn", "#bfa280"],
    ["Mushroom", "#b29b82"],
    ["Dusty Beige", "#bfac94"],
  ]),
  shades("Yellows & Oranges", [
    ["Pastel Yellow", "#fde666"],
    ["Lemon Yellow", "#fbdf51"],
    ["Golden Yellow", "#f9ca2b"],
    ["Mustard", "#f3b31f"],
    ["Apricot", "#fcb54f"],
    ["Peach", "#fdb468"],
    ["Amber", "#fdac18"],
    ["Tangerine", "#fd7b15"],
    ["Burnt Orange", "#f96511"],
    ["Rust", "#e2460d"],
    ["Pumpkin", "#e2420c"],
    ["Terracotta", "#c43112", "terracotta-orange"],
  ]),
  shades("Reds & Pinks", [
    ["Soft Pink", "#fdcfd2"],
    ["Blush Pink", "#f9bfbf"],
    ["Rose Pink", "#e9adac"],
    ["Mauve", "#d79392"],
    ["Dusty Rose", "#cf7474"],
    ["Coral", "#ec5845"],
    ["Poppy Red", "#d30717"],
    ["Cherry Red", "#c50113"],
    ["Brick Red", "#991219"],
    ["Wine Red", "#82111e"],
    ["Berry", "#711529"],
    ["Burgundy", "#6f111f"],
  ]),
];

const seen = new Set<string>();

export const COLOURS: PaintColour[] = groups.flat().filter((colour) => {
  if (seen.has(colour.id)) return false;
  seen.add(colour.id);
  return true;
});

function pick(ids: string[]): PaintColour[] {
  return ids
    .map((id) => COLOURS.find((colour) => colour.id === id))
    .filter((colour): colour is PaintColour => Boolean(colour));
}

const emulsionTin = "/Gold%20prime%20Paints-1.png";
const satinTin = "/Gold%20prime%20Paints-2.png";
const gravitexTin = "/Gold%20prime%20Paints-4.png";
const trowelTin = "/Gold%20prime%20Paints-5.png";
const trowelRooms = [
  "/Gold%20prime%20trowel%20finish-1.jpeg",
  "/Gold%20prime%20trowel%20finish%20-%202.jpeg",
];

export const products: Product[] = [
  {
    id: "acrylic-emulsion",
    slug: "acrylic-emulsion",
    name: "Acrylic Emulsion",
    price: 18500,
    range: "indoor",
    places: ["indoor", "outdoor"],
    category: "Emulsion",
    badge: "Standard quality",
    shortDesc: "Acrylic Emulsion, a standard-quality paint for interior and exterior.",
    description:
      "Acrylic Emulsion is a standard-quality decorative coating for walls, ceilings, plaster, and concrete. It gives rich, vibrant colour, excellent coverage, and a washable finish indoors and outdoors.",
    image: emulsionTin,
    images: [emulsionTin],
    colours: pick([
      "pure-white",
      "ivory",
      "baby-blue",
      "mint-green",
      "pastel-yellow",
      "soft-pink",
      "light-grey",
      "sand-beige",
    ]),
    features: [
      "Standard quality",
      "Interior and exterior",
      "Rich and vibrant colours",
      "Excellent coverage",
      "Washable and easy to clean",
      "Durable and long lasting",
      "Suitable for walls, ceilings, plaster, and concrete",
    ],
  },
  {
    id: "satin",
    slug: "satin",
    name: "Satin",
    price: 42000,
    range: "indoor",
    places: ["indoor", "outdoor"],
    category: "Satin",
    badge: "Luxury finish",
    shortDesc: "Satin, a luxury finish for interior and exterior.",
    description:
      "Satin is a premium luxury finish with a smooth satin sheen. It gives rich, vibrant colour, excellent coverage, and long-lasting protection indoors and outdoors.",
    image: satinTin,
    images: [satinTin, "/Satin%20finish.jpeg", "/Satin%20finish%20-2.jpeg"],
    colours: pick([
      "navy-blue",
      "golden-yellow",
      "pure-white",
      "ivory",
      "cream",
      "pearl-white",
      "shell-white",
      "cotton",
    ]),
    features: [
      "Interior and exterior luxury finish",
      "Rich and vibrant colours",
      "Smooth satin finish",
      "Durable and washable",
      "Premium quality",
      "Excellent coverage and long-lasting protection",
    ],
  },
  {
    id: "gravitex",
    slug: "gravitex",
    name: "Gravitex",
    price: 48000,
    range: "outdoor",
    places: ["indoor", "outdoor"],
    category: "Texture",
    badge: "Luxury finish",
    shortDesc: "Gravitex, a textured luxury finish for interior and exterior.",
    description:
      "Gravitex is a premium textured finish for interior and exterior walls. It is durable, weather resistant, and gives a fine texture that hides imperfections.",
    image: gravitexTin,
    images: [gravitexTin, "/Gravitex%20paint.jpeg"],
    colours: pick([
      "sage-green",
      "stone-grey",
      "ivory",
      "pure-white",
      "charcoal-grey",
      "ash-grey",
      "cream",
      "cloud-grey",
    ]),
    features: [
      "Interior and exterior luxury finish",
      "Rich and vibrant colours",
      "Durable and weather resistant",
      "Excellent texture finish",
      "Hides wall imperfections",
      "Premium quality",
    ],
  },
  {
    id: "trowel",
    slug: "trowel",
    name: "Trowel",
    price: 48000,
    range: "indoor",
    places: ["indoor", "outdoor"],
    category: "Texture",
    badge: "Trowel finish",
    shortDesc: "Trowel, a textured interior finish for walls and ceilings.",
    description:
      "Trowel is a premium trowel finish. On interior walls it gives a fine, speckled texture in grey, with a strong coating that is durable and weather resistant.",
    image: trowelRooms[0],
    images: [...trowelRooms, trowelTin],
    outdoorImage: trowelTin,
    outdoorImages: [trowelTin],
    colours: pick([
      "light-grey",
      "silver-grey",
      "ash-grey",
      "stone-grey",
      "mist-grey",
      "graphite-grey",
      "charcoal-grey",
      "pure-white",
    ]),
    features: [
      "Exclusive trowel finish",
      "Interior and exterior",
      "Strong and durable",
      "Weather resistant",
      "Premium quality",
      "Long-lasting beauty",
    ],
  },
  {
    id: "gold-prime-super-satin",
    slug: "gold-prime-super-satin",
    name: "Gold Prime Super Satin",
    price: 42000,
    range: "indoor",
    places: ["indoor"],
    category: "Satin",
    badge: "Interior",
    shortDesc: "Gold Prime Super Satin, a soft sheen for interior walls.",
    description:
      "Gold Prime Super Satin is a luxurious interior finish with a soft sheen. It is washable, durable, and made for living rooms and homes that want rich, lasting colour.",
    image: "/Gold%20prime%20super%20satin.jpeg",
    images: ["/Gold%20prime%20super%20satin.jpeg"],
    colours: pick([
      "berry",
      "wine-red",
      "burgundy",
      "mauve",
      "dusty-rose",
      "pure-white",
      "ivory",
      "charcoal-grey",
    ]),
    features: [
      "Interior satin with a soft sheen",
      "Excellent washability",
      "Superior durability",
      "Rich, lasting colour",
      "Wide spreading capacity",
    ],
  },
  {
    id: "gold-prime-super-matt-paint",
    slug: "gold-prime-super-matt-paint",
    name: "Gold Prime Super Matt Paint",
    price: 36000,
    range: "outdoor",
    places: ["outdoor"],
    category: "Matt",
    badge: "Exterior",
    shortDesc: "Gold Prime Super Matt Paint for exterior walls.",
    description:
      "Gold Prime Super Matt Paint is the exterior matt finish. A smooth, elegant matt with excellent coverage for outside walls, homes, and apartments. Wide spreading capacity, and suitable for every colour in the chart.",
    image: "/Outdoor-look-1.png",
    images: ["/Outdoor-look-1.png", "/Outdoor-look-2.png", "/Outdoor-look-3.png", "/Outdoor-look-4.png"],
    outdoorImage: "/Outdoor-look-1.png",
    outdoorImages: ["/Outdoor-look-1.png", "/Outdoor-look-2.png", "/Outdoor-look-3.png", "/Outdoor-look-4.png"],
    colours: pick([
      "cream",
      "greige",
      "sage-green",
      "powder-blue",
      "warm-beige",
      "dove-grey",
      "blush-pink",
      "ivory",
    ]),
    features: [
      "Smooth and elegant matt finish",
      "Excellent coverage and a modern finish",
      "Exterior matt paint",
      "Ideal for homes and apartments",
      "Wide spreading capacity",
      "Suitable for all colours",
    ],
  },
];

export const testimonials = [
  {
    quote:
      "I recently renovated my living room and used Goldprime Paints. The coverage and finish were outstanding, and the colours look even better than I imagined. The customer support team was also incredibly helpful in guiding me through the selection process.",
    name: "Ayodele",
    city: "Homeowner",
  },
  {
    quote:
      "I decided to repaint my office and went with Goldprime Paints. The application was smooth, and the final look is professional and clean. The durability of the paint is also impressive. It has made a significant difference in the ambiance of my workspace.",
    name: "Chinelo",
    city: "Office Manager",
  },
  {
    quote:
      "As an interior designer, I always look for quality products for my clients. Goldprime Paints has been a game-changer for me. The wide range of colours and finishes available helps me bring my creative visions to life. My clients are always impressed with the results. Thank you, Goldprime Paints!",
    name: "Nia",
    city: "Interior Designer",
  },
];
