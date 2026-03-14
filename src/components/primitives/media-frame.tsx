import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface MediaFrameProps {
  src: string
  alt: string
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide' | 'hero'
  priority?: boolean
  className?: string
  overlay?: boolean
}

const aspectMap = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  hero: 'aspect-[16/10]',
}

export function MediaFrame({
  src,
  alt,
  aspectRatio = 'portrait',
  priority = false,
  className,
  overlay = false,
}: MediaFrameProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-bg-muted',
        aspectMap[aspectRatio],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {overlay && (
        <div className="absolute inset-0 bg-bg-inverse/10" />
      )}
    </div>
  )
}
