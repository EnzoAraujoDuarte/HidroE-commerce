import { notFound } from 'next/navigation'
import { commerce, resolveCommerce } from '@/lib/commerce'
import { StorefrontUnavailable } from '@/components/commerce'
import { ProductView, RelatedProducts } from '@/features/product'
import { Footer } from '@/components/layout/footer'

interface ProductPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params
  const { data: product, error } = await resolveCommerce(() =>
    commerce.getProduct(handle)
  )

  if (error) {
    return {
      title: 'Product — HYDROGEN',
      description: 'Hydrogen product page.',
    }
  }

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.title} — HYDROGEN`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params

  const [productResult, productsResult] = await Promise.all([
    resolveCommerce(() => commerce.getProduct(handle)),
    resolveCommerce(() => commerce.getProducts({ first: 5 })),
  ])

  if (productResult.error?.code === 'NETWORK') {
    return (
      <>
        <StorefrontUnavailable
          title="This product is temporarily unavailable."
          description="We couldn't reach the storefront data for this product right now. Please try again shortly, or continue browsing the wider collection."
          primaryHref="/collection"
          primaryLabel="Browse collection"
          secondaryHref="/lookbook"
          secondaryLabel="Open lookbook"
        />
        <Footer />
      </>
    )
  }

  if (productResult.error) {
    throw productResult.error
  }

  const product = productResult.data

  if (!product) {
    notFound()
  }

  if (productsResult.error && productsResult.error.code !== 'NETWORK') {
    throw productsResult.error
  }

  const relatedProducts = (productsResult.data ?? []).filter((p) => p.handle !== handle)

  return (
    <>
      <ProductView product={product} />
      <RelatedProducts products={relatedProducts} />
      <Footer />
    </>
  )
}
