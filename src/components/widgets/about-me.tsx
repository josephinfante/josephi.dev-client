import type { Music, SteamPresence } from '@/hooks/use-stream';
import emojiWithLaptop from '@/assets/emoji-with-laptop.png';
import emojiWaving from '@/assets/emoji-waving.png';

type Props = {
  music: Music | null;
  steam: SteamPresence | null;
};

const getStatus = (music: Music | null, steam: SteamPresence | null) => {
  if (steam?.state === 'PLAYING') {
    return {
      label: 'Playing',
      dotClassName: 'bg-sky-400',
      badgeClassName: 'border-sky-300/30 bg-sky-500/10 text-sky-300',
    };
  }

  if (music && music.state !== 'STOPPED') {
    return {
      label: 'Working',
      dotClassName: 'bg-emerald-400',
      badgeClassName: 'border-emerald-300/30 bg-emerald-500/10 text-emerald-300',
    };
  }

  return {
    label: 'Offline',
    dotClassName: 'bg-slate-400',
    badgeClassName: 'border-foreground/15 bg-white/5 text-foreground/80',
  };
};

export const AboutMeWidget = ({ music, steam }: Props) => {
  const status = getStatus(music, steam);
  const avatar = music ? emojiWithLaptop : emojiWaving;

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-card/70 p-5 text-foreground shadow-2xl backdrop-blur-xl md:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(43,172,227,0.2),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(129,140,248,0.16),transparent_40%)]" />

      <div className="relative z-10 flex items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden md:h-18 md:w-18">
            <img
              src={avatar}
              alt="Joseph avatar"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">About me</p>
            <h2 className="text-xl font-bold leading-tight md:text-2xl">
              Hey, I&apos;m Joseph <span className="text-primary">— Software Developer.</span>
            </h2>
          </div>
        </div>
        <div
          className={`absolute inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${status.badgeClassName}`}
          style={{ top: '-4px', right: '-4px' }}
        >
          <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} />
          {status.label}
        </div>
      </div>

      <div className="relative z-10 mt-5 space-y-2 text-sm text-foreground/85 md:text-base">
        <p>I design and build software products, from APIs to internal platforms.</p>
        <p>I value clear architecture, performance, and maintainable systems.</p>
        <p>Long-term thinking, clean systems, and creative engineering.</p>
      </div>
    </div>
  );
};
