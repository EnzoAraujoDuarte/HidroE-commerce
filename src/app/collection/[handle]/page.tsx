import { notFound } from 'next/navigation'
import { commerce, resolveCommerce } from '@/lib/commerce'
import { Container, Section } from '@/components/primitives'
import { ProductGrid, StorefrontUnavailable } from '@/components/commerce'
import { CollectionHeader, CollectionEmpty } from '@/features/collection'
import { Footer } from '@/components/layout/footer'

interface CollectionPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { handle } = await params

  const { data: collection, error } = await resolveCommerce(() =>
    commerce.getCollection({ handle })
  )

  if (error) {
    return {
      title: 'Collection — HYDROGEN',
      description: 'Hydrogen collection page.',
    }
  }

  if (!collection) {
    return { title: 'Collection Not Found' }
  }

  return {
    title: `${collection.title} — HYDROGEN`,
    description: collection.description,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params

  const { data: collection, error } = await resolveCommerce(() =>
    commerce.getCollection({ handle, first: 50 })
  )

  if (error?.code === 'NETWORK') {
    return (
      <>
        <StorefrontUnavailable
          title="This collection is temporarily unavailable."
          description="We couldn't reach the product catalog for this route just now. Please try again in a moment, or continue exploring the rest of the experience."
          primaryHref="/collection"
          primaryLabel="Browse all products"
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

  if (!collection) {
    notFound()
  }

  const hasProducts = collection.products.length > 0

  return (
    <>
      <CollectionHeader collection={collection} />

      <Section spacing="lg" className="bg-bg">
        <Container size="wide">
          {hasProducts ? (
            <ProductGrid products={collection.products} />
          ) : (
            <CollectionEmpty />
          )}
        </Container>
      </Section>

      <Footer />
    </>
  )
}
