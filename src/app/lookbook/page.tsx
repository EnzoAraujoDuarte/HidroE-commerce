import { commerce, resolveCommerce } from '@/lib/commerce'
import { Footer } from '@/components/layout/footer'
import { LookbookExperience } from '@/features/lookbook'
import { lookbookData } from '@/lib/data/editorial-data'

export const metadata = {
  title: 'Lookbook — HYDROGEN',
  description:
    'A premium editorial route through Hydrogen’s collection, focused on materiality, movement and quiet product confidence.',
}

export default async function LookbookPage() {
  const handles = Array.from(
    new Set(
      lookbookData.chapters
        .map((chapter) => chapter.shopCollectionHandle)
        .filter((handle): handle is string => Boolean(handle))
    )
  )

  const collections = await Promise.all(
    handles.map(async (handle) => {
      const result = await resolveCommerce(() =>
        commerce.getCollection({ handle, first: 3 })
      )

      if (result.error && result.error.code !== 'NETWORK') {
        throw result.error
      }

      return [handle, result.data] as const
    })
  )

  const shopCollectionsByHandle = collections.reduce<Record<string, NonNullable<(typeof collections)[number][1]>>>(
    (accumulator, [handle, collection]) => {
      if (collection) {
        accumulator[handle] = collection
      }

      return accumulator
    },
    {}
  )

  return (
    <>
      <LookbookExperience shopCollectionsByHandle={shopCollectionsByHandle} />
      <Footer />
    </>
  )
}
