'use client'

import { CollectionError } from '@/features/collection'

export default function CollectionErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <CollectionError error={error} reset={reset} />
}
