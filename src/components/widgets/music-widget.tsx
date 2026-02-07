import type { Music } from '@/hooks/use-stream';
import { MarqueeText } from '../ui/marquee-text';
import { VisualizerBars } from '../ui/visualizer-bars';

type Props = {
  music: Music | null;
  isLoading: boolean;
  isPlaying: boolean;
  progressPercent: number;
  timeLabel: string;
};

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const MusicWidget = ({ music, isLoading, isPlaying, progressPercent, timeLabel }: Props) => {
  const offset = CIRCUMFERENCE * (1 - Math.min(100, Math.max(0, progressPercent)) / 100);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-card/70 p-4 text-foreground shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 group">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(43,172,227,0.2),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(129,140,248,0.16),transparent_40%)]" />
      {isLoading ? (
        <div className="relative z-10 flex h-full items-center justify-center py-16 text-slate-300">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-500 border-t-cyan-300" />
        </div>
      ) : music ? (
        <>
          <div className="absolute top-2 right-2 z-20 rounded-full border border-foreground/10 bg-foreground/10 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-foreground/90">
            {timeLabel}
          </div>
          <div className="absolute bottom-2 right-2 z-20">
            <VisualizerBars isPlaying={isPlaying} />
          </div>

          <div className="relative z-10 flex items-center py-2 gap-6 h-full">
            <div className="relative shrink-0 w-30 h-30 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-slate-700/50"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r={RADIUS}
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  className="text-[#2bace3]/50 drop-shadow-[0_0_4px_rgba(43,172,227,0.6)] transition-[stroke-dashoffset] duration-700 ease-out"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r={RADIUS}
                  stroke="currentColor"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-2 rounded-full overflow-hidden shadow-inner border border-white/5">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${music.cover}')` }}
                />
                <div className="absolute inset-0 bg-black/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#2bace3]" />
                <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
                  {music.state === 'PLAYING'
                    ? 'Listening To'
                    : music.state === 'PAUSED'
                      ? 'Paused'
                      : 'Stopped'}
                </p>
              </div>
              <div className="flex flex-col mb-3 min-w-0">
                <MarqueeText
                  text={music.title}
                  containerClassName="w-full"
                  textClassName="text-xl font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors duration-300"
                  durationMs={12000}
                />
                <p className="text-sm font-medium text-foreground/50 truncate mt-0.5">
                  {music.artist}
                </p>
              </div>
              {music.listenUrl ? (
                <a
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/50 hover:text-foreground transition-colors group/link w-fit"
                  href={music.listenUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Listen on YouTube Music</span>
                  <span className="text-[16px] text-primary transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="relative z-10 flex h-full items-center justify-center py-16 text-slate-300">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em]">
            Nothing Playing
          </div>
        </div>
      )}
    </div>
  );
};
