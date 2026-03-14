export const primaryNavigation = [
  { href: '/collection', label: 'Collection' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/atelier', label: 'Atelier' },
]

export const mobileNavigation = [
  { href: '/', label: 'Home' },
  ...primaryNavigation,
]

export const footerExploreNavigation = [
  ...primaryNavigation,
  { href: '/', label: 'Home' },
]

export const footerSupportItems = [
  'Complimentary shipping on orders over $150',
  '30-day returns on every order',
  'Studio support within one business day',
]
