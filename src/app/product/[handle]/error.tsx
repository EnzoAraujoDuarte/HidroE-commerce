'use client'

import { Container, Heading, Text, Button } from '@/components/primitives'

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Container size="narrow" className="text-center">
        <Heading as="h1" size="lg" className="mb-4">
          Something went wrong
        </Heading>
        <Text color="secondary" className="mb-8">
          We couldn&apos;t load this product. Please try again.
        </Text>
        <Button onClick={reset}>Try again</Button>
      </Container>
    </div>
  )
}
