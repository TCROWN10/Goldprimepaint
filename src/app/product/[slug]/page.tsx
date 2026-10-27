import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductDetail } from "@/components/ProductDetail";
import { findProduct } from "@/lib/data";
import { getSiteContent } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = findProduct(content.products, slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = findProduct(content.products, slug);
  if (!product) notFound();

  return (
    <>
      <Header variant="back" backHref="/shop" />
      <main className="flex-1">
        <ProductDetail product={product} />
      </main>
    </>
  );
}
