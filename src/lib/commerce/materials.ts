import type { ProductMaterialProfile } from './types'

const MATERIAL_NOUNS = [
  'cotton',
  'wool',
  'cashmere',
  'silk',
  'linen',
  'denim',
  'nylon',
  'polyester',
  'leather',
  'suede',
  'canvas',
  'jersey',
  'fleece',
  'twill',
  'viscose',
  'cupro',
  'modal',
  'hemp',
  'poplin',
  'satin',
  'terry',
  'knit',
]

const MATERIAL_TAGS = new Set(MATERIAL_NOUNS)

const NOTE_TOKENS = [
  ...MATERIAL_NOUNS,
  'organic',
  'recycled',
  'stretch',
  'breathable',
  'lightweight',
  'plush',
  'soft',
  'brushed',
  'washed',
]

const HTML_ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
}

const compositionPattern = new RegExp(
  `\\b(?:\\d{1,3}%\\s+)?(?:organic\\s+|recycled\\s+|brushed\\s+|washed\\s+|soft\\s+|plush\\s+|breathable\\s+|stretch\\s+|double-face\\s+|merino\\s+|italian\\s+|fine\\s+|heavyweight\\s+|lightweight\\s+|cozy\\s+){0,3}(?:${MATERIAL_NOUNS.join('|')})\\b`,
  'gi'
)

function decodeEntities(value: string) {
  return value.replace(
    /&nbsp;|&amp;|&quot;|&#39;/g,
    (entity) => HTML_ENTITY_MAP[entity] ?? entity
  )
}

function normalizeText(value?: string) {
  if (!value) {
    return ''
  }

  return decodeEntities(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function dedupe(values: string[]) {
  const seen = new Set<string>()

  return values.filter((value) => {
    const normalized = value.trim().toLowerCase()

    if (!normalized || seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

function splitSentences(value: string) {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function hasMaterialSignal(sentence: string) {
  const lower = sentence.toLowerCase()
  return NOTE_TOKENS.some((token) => lower.includes(token)) || /\b\d{1,3}%\b/.test(lower)
}

function startCase(value: string) {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

export function buildMaterialProfile({
  description,
  descriptionHtml,
  tags = [],
}: {
  description?: string
  descriptionHtml?: string
  tags?: string[]
}): ProductMaterialProfile | null {
  const text = normalizeText(descriptionHtml || description)
  const sentences = splitSentences(text)
  const descriptionComposition = dedupe(text.match(compositionPattern) ?? [])
  const descriptionNotes = dedupe(
    sentences.filter((sentence) => hasMaterialSignal(sentence))
  ).slice(0, 3)

  const tagComposition = dedupe(
    tags
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => MATERIAL_TAGS.has(tag))
      .map((tag) => startCase(tag))
  )

  const composition = dedupe([
    ...descriptionComposition.map((entry) => entry.trim()),
    ...tagComposition,
  ]).slice(0, 4)

  if (!composition.length && !descriptionNotes.length) {
    return null
  }

  const source =
    descriptionNotes.length && tagComposition.length
      ? 'description+tags'
      : descriptionNotes.length || descriptionComposition.length
        ? 'description'
        : 'tags'

  return {
    composition,
    notes: descriptionNotes,
    source,
  }
}
