import Link from 'next/link'
import { Container, Divider, Text } from '@/components/primitives'
import {
  footerExploreNavigation,
  footerSupportItems,
} from '@/lib/site/navigation'

export function Footer() {
  return (
    <footer className="bg-bg border-t border-border">
      <Container size="wide" className="py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-2">
            <Link href="/" className="ui-link inline-block text-xl font-medium tracking-tight">
              HYDROGEN
            </Link>
            <Text color="secondary" className="mt-4 max-w-xs">
              Contemporary fashion for the modern individual. Thoughtfully designed, responsibly made.
            </Text>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4">
              Explore
            </h4>
            <nav className="flex flex-col gap-2.5">
              {footerExploreNavigation.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4">
              Support
            </h4>
            <div className="flex flex-col gap-2.5">
              {footerSupportItems.map((item) => (
                <Text key={item} size="sm" color="secondary">
                  {item}
                </Text>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <Text size="sm" color="muted">
            © {new Date().getFullYear()} Hydrogen. All rights reserved.
          </Text>
          <Text size="sm" color="muted">
            Portfolio Project
          </Text>
        </div>
      </Container>
    </footer>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="ui-link text-sm text-text-secondary hover:text-text transition-colors duration-200"
    >
      {children}
    </Link>
  )
}
