'use client'

import { useState } from 'react'
import { Divider } from '@/components/primitives'
import type { ProductMaterialProfile } from '@/lib/commerce'
import { cn } from '@/lib/utils/cn'

interface ProductDetailsProps {
  description?: string
  descriptionHtml?: string
  materialProfile: ProductMaterialProfile | null
}

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ui-link flex w-full items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">{title}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn(
            'transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function ProductDetails({
  description,
  descriptionHtml,
  materialProfile,
}: ProductDetailsProps) {
  if (!description && !descriptionHtml) return null

  return (
    <>
      <Divider />
      <div className="pt-2">
        <AccordionItem title="Description" defaultOpen>
          {descriptionHtml ? (
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <p className="text-sm text-text-secondary leading-relaxed">
              {description}
            </p>
          )}
        </AccordionItem>

        {materialProfile && (
          <AccordionItem title="Material Notes">
            <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
              {materialProfile.composition.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {materialProfile.composition.map((entry) => (
                    <span
                      key={entry}
                      className="inline-flex items-center rounded-full border border-border bg-bg-muted px-3 py-1.5 text-xs text-text-secondary"
                    >
                      {entry}
                    </span>
                  ))}
                </div>
              )}
              {materialProfile.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </AccordionItem>
        )}

        <AccordionItem title="Shipping & Returns">
          <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
            <p>Free shipping on orders over $150.</p>
            <p>Standard delivery 3-5 business days.</p>
            <p>Free returns within 30 days of purchase.</p>
          </div>
        </AccordionItem>
      </div>
    </>
  )
}
