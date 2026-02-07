import { useLayoutEffect, useRef, useState } from 'react'

type Props = {
  text: string
  containerClassName?: string
  textClassName?: string
  durationMs?: number
}

export const MarqueeText = ({
  text,
  containerClassName,
  textClassName,
  durationMs = 12000,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const textEl = textRef.current
      if (!container || !textEl) return
      setIsOverflowing(textEl.scrollWidth > container.clientWidth + 2)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [text])

  if (!isOverflowing) {
    return (
      <div ref={containerRef} className={`marquee ${containerClassName ?? ''}`}>
        <span ref={textRef} className={`marquee__static ${textClassName ?? ''}`}>
          {text}
        </span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`marquee ${containerClassName ?? ''}`}
      style={{ ['--marquee-duration' as string]: `${durationMs}ms` }}
    >
      <div className="marquee__track">
        <div className="marquee__inner">
          <span ref={textRef} className={`marquee__item ${textClassName ?? ''}`}>
            {text}
          </span>
        </div>
        <div className="marquee__inner" aria-hidden="true">
          <span className={`marquee__item ${textClassName ?? ''}`}>{text}</span>
        </div>
      </div>
    </div>
  )
}
