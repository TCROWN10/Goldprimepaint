import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import {
  COLOURS,
  products as defaultProducts,
  testimonials as defaultTestimonials,
} from "@/lib/catalogue";
import type { PaintColour, Product, TinSize } from "@/lib/data";

export type StoryImage = { src: string; alt: string };
export type AboutStep = { label: string; image: string; alt: string };

export type SiteContent = {
  business: {
    name: string;
    company: string;
    phoneDisplay: string;
    phoneSecondary: string;
    whatsappNumber: string;
    whatsappCareMessage: string;
    email: string;
    website: string;
    address: string;
    city: string;
    country: string;
    locationLine: string;
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
  };
  seo: {
    title: string;
    titleSuffix: string;
    description: string;
  };
  nav: {
    shop: string;
    custom: string;
    about: string;
    contact: string;
    shopCta: string;
    back: string;
  };
  rangeLabels: { indoor: string; outdoor: string };
  home: {
    browseLabel: string;
    customCta: string;
    ratingText: string;
    headline: string;
    subhead: string;
    shopNow: string;
    heroStoryLink: string;
    categoriesEyebrow: string;
    categoriesTitle: string;
    storyTitle: string;
    storyBody: string;
    storyLink: string;
    storyImages: StoryImage[];
    testimonialEyebrow: string;
    testimonialTitle: string;
    rangesTitle: string;
    paintRanges: {
      title: string;
      body: string;
      image: string;
      alt: string;
      slug: string;
    }[];
    solutionsTitle: string;
    solutionsBody: string;
    solutionsCta: string;
    solutionsImages: StoryImage[];
    sustainTitle: string;
    sustainIntro: string;
    sustainPoints: { title: string; body: string }[];
    sustainClosing: string;
    sustainCta: string;
    sustainImage: StoryImage;
    swipeHint: string;
    colourLabel: string;
    dragHint: string;
  };
  shop: {
    eyebrow: string;
    empty: string;
    chartEyebrow: string;
    chartTitle: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    steps: AboutStep[];
    bannerTitle: string;
    bannerBody: string;
    bannerCta: string;
    vision: string;
    mission: string;
    value: string;
    letter: string;
    letterName: string;
    letterRole: string;
  };
  custom: {
    eyebrow: string;
    title: string;
    body: string;
    whatsappMessage: string;
    whatsappButton: string;
    shopButton: string;
    images: StoryImage[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    whatsappMessage: string;
    whatsappButton: string;
  };
  footer: {
    exploreLabel: string;
    followLabel: string;
    whatsappMessage: string;
    blurb: string;
    copyright: string;
  };
  checkout: {
    eyebrow: string;
    title: string;
    note: string;
    continueButton: string;
    editLink: string;
    colourLabel: string;
    tinLabel: string;
    quantityLabel: string;
    totalLabel: string;
  };
  orderSent: {
    eyebrow: string;
    title: string;
    body: string;
    whatsappButton: string;
    whatsappMessage: string;
    shopButton: string;
    footnote: string;
  };
  order: {
    greeting: string;
    intro: string;
    closing: string;
  };
  productUi: {
    colourLabel: string;
    tinLabel: string;
    coverageLabel: string;
    missingColour: string;
    qtyLabel: string;
    orderButton: string;
  };
  colours: PaintColour[];
  tinSizes: TinSize[];
  products: Product[];
  testimonials: { quote: string; name: string; city: string }[];
};

const FILE = path.join(process.cwd(), "data", "site-content.json");

export function defaultSiteContent(): SiteContent {
  return {
    business: {
      name: "GOLDPRIME PAINTS",
      company: "Goldprime Global Nig. Ltd.",
      phoneDisplay: "0805 027 2664",
      phoneSecondary: "0916 799 8541",
      whatsappNumber: "2348050272664",
      whatsappCareMessage: "Hello Goldprime — I'd like customer care support.",
      email: "info@goldprimepaints.com",
      website: "https://www.goldprimepaints.com",
      address: "",
      city: "",
      country: "Nigeria",
      locationLine: "NIGERIA",
      instagramUrl: "https://instagram.com/goldprimepaints",
      facebookUrl: "https://facebook.com/goldprimepaints",
      tiktokUrl: "",
    },
    seo: {
      title: "GOLDPRIME PAINTS — Choose Your Shade",
      titleSuffix: "GOLDPRIME PAINTS",
      description:
        "Goldprime Global Nig. manufactures Acrylic Emulsion, Satin, Gravitex, and Trowel. Customer care 0805 027 2664.",
    },
    nav: {
      shop: "Shop",
      custom: "Custom",
      about: "About",
      contact: "Contact",
      shopCta: "Choose your shade",
      back: "Back",
    },
    rangeLabels: { indoor: "Interior", outdoor: "Exterior" },
    home: {
      browseLabel: "Browse the collection",
      customCta: "Request a custom colour",
      ratingText: "Premium quality. Lasting beauty.",
      headline: "Choose your shade.",
      subhead: "Make it yours. Premium interior and exterior paints from Goldprime.",
      shopNow: "Shop now",
      heroStoryLink: "Read our story →",
      categoriesEyebrow: "THE PAINTS",
      categoriesTitle: "The paints",
      storyTitle: "Who we are",
      storyBody:
        "At Goldprime Paints, we don't just add colour. We create lasting impressions through quality, innovation and excellence.",
      storyLink: "Read our story →",
      storyImages: [
        { src: "/Outdoor-look-1.png", alt: "White and charcoal exterior finished with Goldprime" },
        { src: "/Outdoor-look-3.png", alt: "Peach and white exterior" },
        { src: "/Outdoor-look-4.png", alt: "White and brown exterior" },
      ],
      testimonialEyebrow: "PEOPLE SAY ABOUT US",
      testimonialTitle: "Clients' Testimonials",
      rangesTitle: "Discover Our Premium Paint Ranges",
      paintRanges: [
        {
          title: "Acrylic Emulsion",
          body: "Innovative and versatile paints for a variety of surfaces. Ideal for residential and commercial projects, with exceptional coverage and ease of application.",
          image: "/Outdoor-look-2.png",
          alt: "White and blue exterior finished with Goldprime emulsion",
          slug: "acrylic-emulsion",
        },
        {
          title: "Satin",
          body: "Premium paints designed for superior performance and durability. Perfect for residential and commercial spaces that need a flawless, lasting finish.",
          image: "/Satin%20finish%20-2.jpeg",
          alt: "Interior room with Goldprime satin finish",
          slug: "satin",
        },
        {
          title: "Gravitex",
          body: "Traditional, high-quality textured coatings with excellent coverage and durability. Ideal for residential and commercial applications that need lasting beauty.",
          image: "/Gold%20prime%20trowel%20finish-1.jpeg",
          alt: "Textured interior finished with Goldprime Gravitex",
          slug: "gravitex",
        },
      ],
      solutionsTitle: "Innovative Solutions for Every Space",
      solutionsBody:
        "An exceptionally wide range of colour schemes are available for discerning clients, enabling colour needs to be achieved at all times.\n\nGoldprime Paint is the right solution for all of Nigeria’s paint needs, thanks to our world-class technical assistance, application training, and dedicated client service professionals.",
      solutionsCta: "View Our Ranges",
      solutionsImages: [
        {
          src: "/Outdoor-look-1.png",
          alt: "Modern exterior finished with Goldprime",
        },
        {
          src: "/Satin%20finish%20-2.jpeg",
          alt: "Living space finished with Goldprime satin",
        },
      ],
      sustainTitle: "Our Commitment to Sustainability",
      sustainIntro:
        "At Goldprime Paints, we are dedicated to creating products that not only enhance the beauty of your spaces but also contribute to a healthier planet. Our commitment to sustainability is reflected in every aspect of our business.",
      sustainPoints: [
        {
          title: "Eco-Friendly Products",
          body: "We formulate paints with care for indoor air quality and lasting performance, so homes and workplaces stay beautiful without unnecessary compromise.",
        },
        {
          title: "Sustainable Practices",
          body: "Our manufacturing focuses on minimizing waste and using resources responsibly, ensuring every tin delivers value with less environmental impact.",
        },
        {
          title: "Community Engagement",
          body: "We support local initiatives and share application know-how so Nigerian communities can build and finish spaces with confidence.",
        },
      ],
      sustainClosing:
        "Join us in making a positive impact on the environment while enjoying the finest paints and coatings available.",
      sustainCta: "Contact Us",
      sustainImage: {
        src: "/Outdoor-look-4.png",
        alt: "Exterior finished with Goldprime paints",
      },
      swipeHint: "Swipe up for next finish",
      colourLabel: "COLOUR",
      dragHint: "DRAG TO ROTATE",
    },
    shop: {
      eyebrow: "COLLECTION",
      empty: "No finishes in this collection yet.",
      chartEyebrow: "COLOUR CHART",
      chartTitle: "Premium quality. Lasting beauty.",
    },
    about: {
      eyebrow: "WHO WE ARE",
      title: "GoldPrime Paints",
      body: "GoldPrime Paints is the flagship brand of Goldprime Global Nig. Ltd., a Nigerian-owned company specializing in the manufacturing, supply and professional application of premium decorative and protective coating solutions.\n\nDriven by a passion for excellence, we provide innovative paint products that combine superior quality, aesthetic appeal, and long lasting performance. Our solutions are carefully developed to meet the needs of homeowners, architects, contractors, property developers, government institutions and corporate organizations seeking reliable finishing solutions.\n\nWith a commitment to continuous improvement and customer satisfaction, Goldprime has successfully contributed to numerous residential, commercial and institutional projects, delivering finishes that enhance the beauty while protecting surfaces against harsh environmental conditions.\n\nBeyond manufacturing quality paints, we offer professional painting services, colour consultation, surface preparation and technical support, ensuring that every project benefits from expert guidance and exceptional workmanship.",
      steps: [
        {
          label: "Superior coverage",
          image: "/Outdoor-look-1.png",
          alt: "White and charcoal exterior",
        },
        {
          label: "Long-lasting",
          image: "/Outdoor-look-2.png",
          alt: "Blue textured exterior",
        },
        {
          label: "Rich colour",
          image: "/Outdoor-look-4.png",
          alt: "White and brown exterior",
        },
      ],
      bannerTitle: "Express your world in colours.",
      bannerBody:
        "We create lasting impressions. Premium quality products, superior coverage, long-lasting performance, and rich, vibrant colours.",
      bannerCta: "Choose your shade",
      vision:
        "To become one of Africa's most trusted and innovative paint manufacturing brands, recognized for delivering premium coating solutions that transform spaces, protect investments and inspire confidence through quality, durability and exceptional services.",
      mission:
        "To manufacture and supply premium quality paints and coating solutions using innovative processes and quality raw materials, while delivering outstanding customer service, professional painting solutions and long-term value to every client.",
      value:
        "Quality. We are committed to producing products that meet high standards of performance, consistency, and durability.",
      letter:
        "At Goldprime Paints, we believe colour is more than decoration. It is a reflection of quality, identity and excellence. Every product we manufacture represents our commitment to delivering premium coating solutions that combine beauty, durability and value.\n\nAs a proudly Nigerian company, we are passionate about transforming residential, commercial and institutional spaces through innovative paint products and professional painting services. Our success is built on integrity, consistency and an unwavering dedication to customer satisfaction.\n\nWe value every opportunity to partner with homeowners, contractors, architects, developers and organizations. We remain committed to delivering solutions that exceed expectations.\n\nThank you for choosing Goldprime Paints. We look forward to adding colour and lasting value to your next project.",
      letterName: "Damilola Adeleye",
      letterRole: "Managing Director / Chief Executive Officer",
    },
    custom: {
      eyebrow: "CUSTOM",
      title: "Request a custom colour",
      body: "Tell us the surface, the finish, and the colour. Goldprime offers consultation and surface preparation, then confirms the tin and the shade on WhatsApp.",
      whatsappMessage: "Hello Goldprime — I'd like a custom paint colour.",
      whatsappButton: "Start on WhatsApp",
      shopButton: "Browse finishes",
      images: [
        { src: "/Outdoor-look-1.png", alt: "White and charcoal exterior" },
        { src: "/Outdoor-look-2.png", alt: "Blue textured exterior" },
        { src: "/Outdoor-look-3.png", alt: "Peach and white exterior" },
      ],
    },
    contact: {
      eyebrow: "CUSTOMER CARE",
      title: "Talk to Goldprime",
      body: "Call either customer-care line, or message us on WhatsApp. Email works too.",
      whatsappMessage: "Hello Goldprime!",
      whatsappButton: "Open WhatsApp",
    },
    footer: {
      exploreLabel: "EXPLORE",
      followLabel: "FOLLOW",
      whatsappMessage: "Hello Goldprime!",
      blurb: "Highly washable. Ideal smoothness. Maximum coverage. Durable.",
      copyright: "© 2026 GOLDPRIME GLOBAL NIG. LTD.",
    },
    checkout: {
      eyebrow: "ALMOST THERE",
      title: "Review your order",
      note: "We'll confirm your order on WhatsApp.",
      continueButton: "Continue on WhatsApp",
      editLink: "Edit order",
      colourLabel: "Colour",
      tinLabel: "Tin",
      quantityLabel: "Quantity",
      totalLabel: "Total",
    },
    orderSent: {
      eyebrow: "ORDER SENT",
      title: "Thank you — we've opened WhatsApp so you can confirm with Goldprime.",
      body: "Customer care will reply to confirm the colour, the tin size, and delivery.",
      whatsappButton: "Chat with Goldprime",
      whatsappMessage: "Hello — I just sent an order from the website.",
      shopButton: "Back to shop",
      footnote: "GOLDPRIME GLOBAL NIG. · NIGERIA",
    },
    order: {
      greeting: "Hello Goldprime Paints 👋",
      intro: "I'd like to order:",
      closing: "Please confirm availability. Thank you!",
    },
    productUi: {
      colourLabel: "COLOUR",
      tinLabel: "TIN SIZE",
      coverageLabel: "Coverage guide",
      missingColour: "Need a different colour?",
      qtyLabel: "QTY",
      orderButton: "Order via WhatsApp",
    },
    colours: COLOURS.map((colour) => ({ ...colour })),
    tinSizes: [
      { size: "4L", factor: 0.28 },
      { size: "10L", factor: 0.55 },
      { size: "20L", factor: 1 },
    ],
    products: defaultProducts.map((product) => ({
      ...product,
      colours: product.colours.map((colour) => ({ ...colour })),
      images: [...product.images],
      outdoorImages: product.outdoorImages ? [...product.outdoorImages] : undefined,
      features: product.features ? [...product.features] : [],
    })),
    testimonials: defaultTestimonials.map((item) => ({ ...item })),
  };
}

function mergeSection<T extends object>(base: T, saved: Partial<T> | undefined): T {
  if (!saved || typeof saved !== "object") return base;
  return { ...base, ...saved };
}

export function normalizeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  const base = defaultSiteContent();
  if (!saved || typeof saved !== "object") return base;

  const content: SiteContent = {
    ...base,
    business: mergeSection(base.business, saved.business),
    seo: mergeSection(base.seo, saved.seo),
    nav: mergeSection(base.nav, saved.nav),
    rangeLabels: mergeSection(base.rangeLabels, saved.rangeLabels),
    home: {
      ...mergeSection(base.home, saved.home),
      storyImages:
        Array.isArray(saved.home?.storyImages) && saved.home.storyImages.length
          ? saved.home.storyImages
          : base.home.storyImages,
      paintRanges:
        Array.isArray(saved.home?.paintRanges) && saved.home.paintRanges.length
          ? saved.home.paintRanges
          : base.home.paintRanges,
      solutionsImages:
        Array.isArray(saved.home?.solutionsImages) && saved.home.solutionsImages.length
          ? saved.home.solutionsImages
          : base.home.solutionsImages,
      sustainPoints:
        Array.isArray(saved.home?.sustainPoints) && saved.home.sustainPoints.length
          ? saved.home.sustainPoints
          : base.home.sustainPoints,
      sustainImage: saved.home?.sustainImage?.src
        ? saved.home.sustainImage
        : base.home.sustainImage,
    },
    shop: mergeSection(base.shop, saved.shop),
    about: {
      ...mergeSection(base.about, saved.about),
      steps:
        Array.isArray(saved.about?.steps) && saved.about.steps.length
          ? saved.about.steps
          : base.about.steps,
    },
    custom: {
      ...mergeSection(base.custom, saved.custom),
      images:
        Array.isArray(saved.custom?.images) && saved.custom.images.length
          ? saved.custom.images
          : base.custom.images,
    },
    contact: mergeSection(base.contact, saved.contact),
    footer: mergeSection(base.footer, saved.footer),
    checkout: mergeSection(base.checkout, saved.checkout),
    orderSent: mergeSection(base.orderSent, saved.orderSent),
    order: mergeSection(base.order, saved.order),
    productUi: mergeSection(base.productUi, saved.productUi),
    colours: Array.isArray(saved.colours) && saved.colours.length ? saved.colours : base.colours,
    tinSizes: Array.isArray(saved.tinSizes) && saved.tinSizes.length ? saved.tinSizes : base.tinSizes,
    products: Array.isArray(saved.products) ? saved.products : base.products,
    testimonials: Array.isArray(saved.testimonials) ? saved.testimonials : base.testimonials,
  };

  const byId = new Map(content.colours.map((colour) => [colour.id, colour]));
  content.products = content.products.map((product) => {
    const images = (product.images ?? []).map((src) => src.trim()).filter(Boolean);
    const image = (product.image || images[0] || "").trim();
    return {
      ...product,
      price: Number(product.price) || 0,
      image,
      images: images.length ? images : image ? [image] : [],
      features: (product.features ?? []).map((feature) => feature.trim()).filter(Boolean),
      colours: (product.colours ?? [])
        .map((colour) => byId.get(colour.id) ?? colour)
        .filter((colour) => byId.has(colour.id)),
    };
  });

  content.tinSizes = content.tinSizes
    .map((tin) => ({
      size: String(tin.size || "").trim(),
      factor: Number(tin.factor) || 1,
    }))
    .filter((tin) => tin.size);

  return content;
}

export async function getSiteContent(): Promise<SiteContent> {
  noStore();
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return normalizeContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return defaultSiteContent();
  }
}

export async function saveSiteContent(input: Partial<SiteContent>) {
  const content = normalizeContent(input);
  const slugs = content.products.map((product) => product.slug.trim());
  if (slugs.some((slug) => !slug)) {
    throw new Error("Every product needs a link name.");
  }
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Two products cannot share the same link name.");
  }
  if (content.products.some((product) => !product.name.trim())) {
    throw new Error("Every product needs a name.");
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(content, null, 2));
  return content;
}
