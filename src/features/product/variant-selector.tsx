'use client'

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

  if (options.length === 0) return null

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id}>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-medium text-text">{option.name}</span>
            <span className="text-sm text-text-muted">
              {getSelectedValue(option.name)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = getSelectedValue(option.name) === value
              const isAvailable = isOptionAvailable(option.name, value)

              return (
                <button
                  key={value}
                  onClick={() => onOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={cn(
                    'ui-press rounded-full px-4 py-2 text-sm border transition-all duration-200',
                    isSelected
                      ? 'border-accent bg-accent text-text-inverse'
                      : 'border-border bg-transparent text-text hover:border-accent',
                    !isAvailable && 'opacity-30 cursor-not-allowed line-through'
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
