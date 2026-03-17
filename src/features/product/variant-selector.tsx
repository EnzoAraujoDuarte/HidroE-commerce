'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import type { ProductOption, ProductVariant, SelectedOption } from '@/lib/commerce'

interface VariantSelectorProps {
  options: ProductOption[]
  variants: ProductVariant[]
  selectedOptions: SelectedOption[]
  onOptionChange: (name: string, value: string) => void
}

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  const getSelectedValue = (optionName: string) => {
    return selectedOptions.find((opt) => opt.name === optionName)?.value
  }

  const isOptionAvailable = (optionName: string, optionValue: string) => {
    const otherSelections = selectedOptions.filter((opt) => opt.name !== optionName)
    return variants.some((variant) => {
      const hasThisOption = variant.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === optionValue
      )
      const matchesOthers = otherSelections.every((sel) =>
        variant.selectedOptions.some(
          (opt) => opt.name === sel.name && opt.value === sel.value
        )
      )
      return hasThisOption && matchesOthers && variant.availableForSale
    })
  }

  // For a given option, check if any variants have images keyed to that option
  const optionHasImages = (optionName: string) => {
    return variants.some(
      (v) => v.selectedOptions.some((o) => o.name === optionName) && !!v.image
    )
  }

  // Get the variant image for a specific option value
  const getVariantImage = (optionName: string, optionValue: string) => {
    return variants.find((v) =>
      v.selectedOptions.some((o) => o.name === optionName && o.value === optionValue)
    )?.image
  }

  if (options.length === 0) return null

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const selectedValue = getSelectedValue(option.name)
        const showSwatches = optionHasImages(option.name)

        return (
          <div key={option.id}>
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-text">
                {option.name}
              </span>
              {selectedValue && (
                <span className="text-sm text-text-secondary">{selectedValue}</span>
              )}
            </div>

            {showSwatches ? (
              // Image-based swatches
              <div className="flex flex-wrap gap-2.5">
                {option.values.map((value) => {
                  const isSelected = selectedValue === value
                  const isAvailable = isOptionAvailable(option.name, value)
                  const variantImage = getVariantImage(option.name, value)

                  return (
                    <button
                      key={value}
                      onClick={() => onOptionChange(option.name, value)}
                      disabled={!isAvailable}
                      title={value}
                      aria-label={`${option.name}: ${value}`}
                      aria-pressed={isSelected}
                      className={cn(
                        'relative h-10 w-10 overflow-hidden rounded-[0.6rem] border-2 transition-all duration-200',
                        isSelected
                          ? 'border-text scale-105 shadow-sm'
                          : 'border-transparent hover:border-border',
                        !isAvailable && 'opacity-35 cursor-not-allowed'
                      )}
                    >
                      {variantImage ? (
                        <Image
                          src={variantImage.url}
                          alt={value}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <span className="block h-full w-full bg-border" />
                      )}
                      {!isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-px w-full rotate-45 bg-text-muted/60" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              // Text chips
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedValue === value
                  const isAvailable = isOptionAvailable(option.name, value)

                  return (
                    <button
                      key={value}
                      onClick={() => onOptionChange(option.name, value)}
                      disabled={!isAvailable}
                      aria-pressed={isSelected}
                      className={cn(
                        'ui-press rounded-full px-4 py-2 text-sm border transition-all duration-150',
                        isSelected
                          ? 'border-text bg-text text-text-inverse font-medium'
                          : 'border-border bg-transparent text-text hover:border-text-secondary',
                        !isAvailable && 'opacity-30 cursor-not-allowed line-through'
                      )}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
