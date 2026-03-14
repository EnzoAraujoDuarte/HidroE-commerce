import { Footer } from '@/components/layout/footer'
import { AtelierExperience } from '@/features/atelier'

export const metadata = {
  title: 'Atelier — HYDROGEN',
  description:
    'A contemplative editorial route into Hydrogen’s manifesto, material language and creative signature.',
}

export default function AtelierPage() {
  return (
    <>
      <AtelierExperience />
      <Footer />
    </>
  )
}
