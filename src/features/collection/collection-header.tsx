import { Container, Eyebrow, Heading, Text } from '@/components/primitives'
import type { Collection } from '@/lib/commerce'

interface CollectionHeaderProps {
  collection: Collection
}

export function CollectionHeader({ collection }: CollectionHeaderProps) {
  return (
    <div className="pt-24 pb-12 md:pt-28 md:pb-16 bg-bg">
      <Container size="wide">
        <div className="max-w-2xl">
          <Eyebrow className="mb-4">Collection</Eyebrow>
          <Heading as="h1" size="2xl" className="mb-4">
            {collection.title}
          </Heading>
          {collection.description && (
            <Text color="secondary" size="lg">
              {collection.description}
            </Text>
          )}
          <Text color="muted" size="sm" className="mt-6">
            {collection.productsCount} {collection.productsCount === 1 ? 'piece' : 'pieces'}
          </Text>
        </div>
      </Container>
    </div>
  )
}
