"use client"

import type { CSSProperties } from "react"

const PLACEHOLDER = "/placeholder-image.png"

interface SafeImageProps {
  src?: string | null
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
  style?: CSSProperties
}

export function SafeImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
  style,
}: SafeImageProps) {
  const safeSrc = src?.trim() || PLACEHOLDER

  const fillStyle: CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : {}

  return (
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ ...fillStyle, ...style }}
      onError={(e) => {
        const img = e.currentTarget
        if (!img.dataset.errored) {
          img.dataset.errored = "1"
          img.src = PLACEHOLDER
        }
      }}
    />
  )
}
