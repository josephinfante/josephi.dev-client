type Props = {
  isPlaying: boolean
  className?: string
}

export const VisualizerBars = ({ isPlaying, className }: Props) => {
  const base = 'eq-bar w-1 rounded-t-sm bg-primary'
  const anim = isPlaying ? '' : 'opacity-50 eq-paused'
  return (
    <div className={`flex gap-0.5 items-end h-4 pb-0.5 ${anim} ${className ?? ''}`}>
      <div className={`${base} h-4`} style={{ animationDelay: '0ms' }} />
      <div className={`${base} h-4`} style={{ animationDelay: '180ms' }} />
      <div className={`${base} h-4`} style={{ animationDelay: '320ms' }} />
      <div className={`${base} h-4`} style={{ animationDelay: '520ms' }} />
    </div>
  )
}
