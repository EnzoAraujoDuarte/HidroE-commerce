import { Container, Section } from '@/components/primitives'
import { ProductGridSkeleton } from '@/components/commerce'

export default function AllProductsLoading() {
  return (
    <>
      <div className="pt-32 pb-16 md:pt-40 md:pb-20 bg-bg">
        <Container size="wide">
          <div className="max-w-2xl animate-pulse">
            <div className="h-3 w-16 bg-bg-muted rounded mb-4" />
            <div className="h-12 w-48 bg-bg-muted rounded mb-4" />
            <div className="h-6 w-80 bg-bg-muted rounded" />
          </div>
        </Container>
      </div>

      <Section spacing="lg" className="bg-bg">
        <Container size="wide">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
              Loading collection
            </span>
            <div className="h-px w-24 overflow-hidden bg-border">
              <div className="h-full w-12 bg-text animate-[loading-line_1s_ease-in-out_infinite]" />
            </div>
          </div>
          <ProductGridSkeleton count={12} />
        </Container>
      </Section>
    </>
  )
}
