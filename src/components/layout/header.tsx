'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Container } from '@/components/primitives'
import { CartTrigger } from '@/features/cart'
import { MobileMenu } from './mobile-menu'
import { primaryNavigation } from '@/lib/site/navigation'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname() ?? ''

  const isImmersiveRoute =
    pathname === '/' || pathname === '/lookbook' || pathname === '/atelier'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isImmersiveRoute && !isScrolled
            ? 'mix-blend-difference'
            : 'bg-bg/95 backdrop-blur-sm border-b border-border/50'
        )}
      >
        <Container size="wide">
          <nav className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className={cn(
                'ui-link text-lg font-medium tracking-tight transition-colors duration-200',
                isImmersiveRoute && !isScrolled ? 'text-text-inverse' : 'text-text'
              )}
            >
              HYDROGEN
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {primaryNavigation.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isLight={isImmersiveRoute && !isScrolled}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className={cn(isImmersiveRoute && !isScrolled && 'mix-blend-difference')}>
                <CartTrigger />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  'ui-icon-button rounded-full md:hidden p-2 transition-colors duration-200',
                  isImmersiveRoute && !isScrolled ? 'text-text-inverse' : 'text-text'
                )}
                aria-label="Open menu"
                data-cursor-label="Menu"
              >
                <MenuIcon />
              </button>
            </div>
          </nav>
        </Container>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}

function NavLink({
  href,
  children,
  isLight,
}: {
  href: string
  children: React.ReactNode
  isLight: boolean
}) {
  const pathname = usePathname() ?? ''
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'ui-link relative text-sm transition-all duration-200 after:absolute after:left-0 after:top-full after:mt-2 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-300',
        isLight
          ? 'text-text-inverse opacity-80 hover:opacity-100'
          : 'text-text-secondary hover:text-text',
        isActive
          ? 'after:scale-x-100 ' + (isLight ? 'opacity-100' : 'text-text')
          : 'after:scale-x-0 hover:after:scale-x-100'
      )}
    >
      {children}
    </Link>
  )
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="3" y1="7" x2="19" y2="7" />
      <line x1="3" y1="15" x2="19" y2="15" />
    </svg>
  )
}
