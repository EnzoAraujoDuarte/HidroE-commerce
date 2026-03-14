import Link from 'next/link'
import { Container, Heading, Text, Button } from '@/components/primitives'

export function CollectionEmpty() {
  return (
    <div className="py-24 md:py-32">
      <Container size="narrow" className="text-center">
        <Heading as="h2" size="lg" className="mb-4">
          No products found
        </Heading>
        <Text color="secondary" className="mb-8">
          This collection is currently empty. Check back soon for new arrivals.
        </Text>
        <Link href="/">
          <Button variant="secondary">Return to home</Button>
        </Link>
      </Container>
    </div>
  )
}
