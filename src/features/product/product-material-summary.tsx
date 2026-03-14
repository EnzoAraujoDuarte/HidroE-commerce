import type { ProductMaterialProfile } from '@/lib/commerce'

interface ProductMaterialSummaryProps {
  materialProfile: ProductMaterialProfile | null
}

const sourceLabelMap = {
  description: 'From product description',
  tags: 'From store tags',
  'description+tags': 'From store data',
} as const

export function ProductMaterialSummary({
  materialProfile,
}: ProductMaterialSummaryProps) {
  if (!materialProfile) {
    return null
  }

  return (
    <div className="border border-border/80 bg-bg-muted/70 px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">
          Material Notes
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
          {sourceLabelMap[materialProfile.source]}
        </p>
      </div>

      {materialProfile.composition.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {materialProfile.composition.map((entry) => (
            <span
              key={entry}
              className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-1.5 text-xs text-text-secondary"
            >
              {entry}
            </span>
          ))}
        </div>
      )}

      {materialProfile.notes.length > 0 && (
        <div className="mt-4 space-y-2">
          {materialProfile.notes.slice(0, 2).map((note) => (
            <p key={note} className="text-sm leading-relaxed text-text-secondary">
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
