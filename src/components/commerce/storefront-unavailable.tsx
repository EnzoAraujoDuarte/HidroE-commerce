import Link from 'next/link'
import { Button, Container, Heading, Text } from '@/components/primitives'

interface StorefrontUnavailableProps {
  title: string
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
}

export function StorefrontUnavailable({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: StorefrontUnavailableProps) {
  return (
    <div className="bg-bg py-24 md:py-32">
      <Container size="narrow" className="text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-text-muted">
          Storefront unavailable
        </p>
        <Heading as="h2" size="lg" className="mt-5">
          {title}
        </Heading>
        <Text size="lg" color="secondary" className="mx-auto mt-5 max-w-xl">
          {description}
        </Text>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={primaryHref}>
            <Button size="lg">{primaryLabel}</Button>
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref}>
              <Button variant="secondary" size="lg">
                {secondaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </div>
  )
}
