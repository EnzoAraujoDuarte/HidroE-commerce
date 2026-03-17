'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { mobileNavigation } from '@/lib/site/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname() ?? ''

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-bg-inverse/40 z-40 md:hidden',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-sm bg-bg z-50 md:hidden',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <span className="text-sm text-text-muted uppercase tracking-wider">Menu</span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="ui-icon-button rounded-full p-2 -mr-2 text-text-secondary hover:text-text transition-colors"
            aria-label="Close menu"
            data-cursor-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul>
            {mobileNavigation.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      'group ui-link flex items-center justify-between px-5 py-5 border-b border-border',
                      'text-lg transition-colors duration-200',
                      isActive ? 'text-text' : 'text-text-secondary'
                    )}
                  >
                    <span>{link.label}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-text-muted transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M6 4l4 4-4 4" />
                    </svg>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-5 py-6 border-t border-border">
          <Link
            href="/"
            onClick={onClose}
            className="ui-link text-lg font-medium tracking-tight"
          >
            HYDRO
          </Link>
          <p className="text-sm text-text-muted mt-2">
            Contemporary fashion for the modern individual.
          </p>
        </div>
      </div>
    </>
  )
}
