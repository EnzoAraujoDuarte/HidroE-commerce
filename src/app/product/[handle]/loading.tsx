import { Container, Section } from '@/components/primitives'

export default function ProductLoading() {
  return (
    <Section spacing="none" className="pt-28 md:pt-32 pb-16 md:pb-24">
      <Container size="wide">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
            Loading product
          </span>
          <div className="h-px w-24 overflow-hidden bg-border">
            <div className="h-full w-12 bg-text animate-[loading-line_1s_ease-in-out_infinite]" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-20 lg:w-20 lg:h-24 bg-bg-muted" />
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] lg:aspect-[4/5] bg-bg-muted" />
          </div>

          <div className="lg:max-w-md lg:ml-auto space-y-6">
            <div className="h-4 w-24 bg-bg-muted rounded" />
            <div className="h-10 w-3/4 bg-bg-muted rounded" />
            <div className="h-6 w-20 bg-bg-muted rounded" />
            <div className="h-px bg-bg-muted" />
            <div className="space-y-4">
              <div className="h-4 w-16 bg-bg-muted rounded" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-16 bg-bg-muted rounded" />
                ))}
              </div>
            </div>
            <div className="h-px bg-bg-muted" />
            <div className="h-12 bg-bg-muted rounded" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
