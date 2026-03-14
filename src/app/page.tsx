import {
  Hero,
  EditorialSection,
  CollectionHighlights,
  BrandStatement,
  Manifesto,
} from '@/features/home'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Hero />
      <EditorialSection />
      <BrandStatement />
      <CollectionHighlights />
      <Manifesto />
      <Footer />
    </>
  )
}
