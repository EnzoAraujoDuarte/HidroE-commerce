'use client'

import { Container, Heading, Text, Button } from '@/components/primitives'

interface CollectionErrorProps {
  error: Error
  reset: () => void
}

export function CollectionError({ error, reset }: CollectionErrorProps) {
  return (
    <div className="py-24 md:py-32">
      <Container size="narrow" className="text-center">
        <Heading as="h2" size="lg" className="mb-4">
          Something went wrong
        </Heading>
        <Text color="secondary" className="mb-8">
          We couldn&apos;t load this collection. Please try again.
        </Text>
        <Button onClick={reset}>Try again</Button>
      </Container>
    </div>
  )
}
