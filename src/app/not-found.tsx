import Link from 'next/link'
import { Container, Heading, Text, Button } from '@/components/primitives'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Container size="narrow" className="text-center py-24">
        <p className="text-8xl md:text-9xl font-light text-text-muted/30 mb-8">
          404
        </p>
        <Heading as="h1" size="lg" className="mb-4">
          Page not found
        </Heading>
        <Text color="secondary" className="mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>
        <Link href="/">
          <Button>Return home</Button>
        </Link>
      </Container>
    </div>
  )
}
