type ParsedProgress = {
  current: number
  total: number
}

const parseTimePart = (value: string) => {
  const clean = value.trim()
  if (!clean) return 0
  const segments = clean.split(':').map((segment) => Number(segment))
  if (segments.some((segment) => Number.isNaN(segment))) {
    return 0
  }
  if (segments.length === 3) {
    return segments[0] * 3600 + segments[1] * 60 + segments[2]
  }
  if (segments.length === 2) {
    return segments[0] * 60 + segments[1]
  }
  return segments[0]
}

export const parseProgress = (progressText: string): ParsedProgress => {
  const [currentRaw, totalRaw] = progressText.split('/')
  const current = parseTimePart(currentRaw ?? '')
  const total = parseTimePart(totalRaw ?? '')
  return { current, total }
}

export const formatSeconds = (seconds: number) => {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}
