'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Container, Heading, Text, Button } from '@/components/primitives'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Container size="narrow" className="text-center py-24">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-bg-muted flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-text-muted"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <Heading as="h1" size="lg" className="mb-4">
          Something went wrong
        </Heading>
        <Text color="secondary" className="mb-8 max-w-sm mx-auto">
          We encountered an unexpected error. Please try again or return to the homepage.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link href="/">
            <Button variant="secondary">Return home</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
