import { commerce, resolveCommerce } from '@/lib/commerce'
import { Container, Section, Eyebrow, Heading, Text } from '@/components/primitives'
import { ProductGrid, StorefrontUnavailable } from '@/components/commerce'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'All Products — HYDROGEN',
  description: 'Browse our complete collection of contemporary fashion pieces.',
}

export default async function AllProductsPage() {
  const { data: products, error } = await resolveCommerce(() =>
    commerce.getProducts({ first: 50 })
  )

  if (error?.code === 'NETWORK') {
    return (
      <>
        <StorefrontUnavailable
          title="The catalog is temporarily unavailable."
          description="We couldn't load the full product feed right now. Please try again shortly, or continue through the editorial routes while the storefront reconnects."
          primaryHref="/"
          primaryLabel="Return home"
          secondaryHref="/lookbook"
          secondaryLabel="Open lookbook"
        />
        <Footer />
      </>
    )
  }

  if (error) {
    throw error
  }

  const safeProducts = products ?? []

  return (
    <>
      {/* Header */}
      <div className="pt-32 pb-16 md:pt-40 md:pb-20 bg-bg">
        <Container size="wide">
          <div className="max-w-2xl">
            <Eyebrow className="mb-4">Shop</Eyebrow>
            <Heading as="h1" size="2xl" className="mb-4">
              All Products
            </Heading>
            <Text color="secondary" size="lg">
              Browse our complete collection of contemporary pieces, thoughtfully
              designed for the modern wardrobe.
            </Text>
            <Text color="muted" size="sm" className="mt-6">
              {safeProducts.length} {safeProducts.length === 1 ? 'piece' : 'pieces'}
            </Text>
          </div>
        </Container>
      </div>

      {/* Product Grid */}
      <Section spacing="lg" className="bg-bg">
        <Container size="wide">
          <ProductGrid products={safeProducts} />
        </Container>
      </Section>

      <Footer />
    </>
  )
}
