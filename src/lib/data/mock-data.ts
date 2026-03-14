// Mock data for homepage — curated images from Unsplash
// These represent the aesthetic direction: contemporary, editorial, premium fashion

export const heroData = {
  eyebrow: 'Spring/Summer 2025',
  title: 'Refined\nEssentials',
  subtitle: 'A curated selection of contemporary pieces designed for the modern wardrobe.',
  cta: {
    label: 'Explore Collection',
    href: '/collection',
  },
  secondaryCta: {
    label: 'Read Lookbook',
    href: '/lookbook',
  },
  media: {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80',
    alt: 'Model wearing contemporary fashion in natural light',
  },
}

export const editorialData = {
  eyebrow: 'Editorial',
  title: 'Form Follows Function',
  description: 'Each piece in our collection is crafted with intention. Premium materials meet considered design, creating garments that transcend seasons.',
  media: {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
    alt: 'Fashion editorial close-up',
  },
}

export const collectionHighlights = [
  {
    id: '1',
    title: 'Featured Pieces',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
    href: '/collection/featured',
  },
  {
    id: '2',
    title: 'Tops',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    href: '/collection/tops',
  },
  {
    id: '3',
    title: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    href: '/collection/bottoms',
  },
]

export const manifestoData = {
  quote: 'We believe in the quiet confidence of well-made clothes. No excess, no compromise.',
  attribution: 'Hydrogen Design Philosophy',
}
