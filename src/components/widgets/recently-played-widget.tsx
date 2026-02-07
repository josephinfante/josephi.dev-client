import type { Music, MusicHistoryItem } from '@/hooks/use-stream';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type Props = {
  items: MusicHistoryItem[];
  current: Music | null;
};

const isSameTrack = (current: Music | null, item: MusicHistoryItem) => {
  if (!current) return false;
  return (
    current.title === item.title &&
    current.artist === item.artist &&
    current.listenUrl === item.listenUrl
  );
};

export const RecentlyPlayedWidget = ({ items, current }: Props) => {
  const filtered = items.filter((item) => !isSameTrack(current, item));
  const trimmed = filtered.slice(0, 4);
  const modalItems = filtered.slice(0, 9);

  return (
    <div className="xl:col-span-4 flex flex-col relative w-full rounded-2xl border border-white/10 bg-card/70 p-4 text-foreground shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 group">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(43,172,227,0.2),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(129,140,248,0.16),transparent_40%)]" />
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xs font-bold tracking-widest text-foreground uppercase flex items-center gap-2">
          Recently Played
          <span className="bg-white/10 text-foreground/60 px-1.5 py-0.5 rounded text-[10px]">
            {trimmed.length}
          </span>
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-wider transition-colors">
              View All
            </button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 text-white border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Recently Played</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3">
              {modalItems.map((item) => (
                <a
                  key={item.id}
                  href={item.listenUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative rounded overflow-hidden aspect-square bg-surface-dark cursor-pointer ring-1 ring-white/5 hover:ring-primary/50 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(40,170,226,0.15)]"
                >
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${item.cover}")` }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <span className="text-primary text-3xl drop-shadow-md">▶</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/90 via-black/60 to-transparent z-20">
                    <p className="text-sm font-bold text-white truncate leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-medium text-white/70 truncate uppercase tracking-wide">
                      {item.artist}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2">
        {trimmed.map((item) => (
          <a
            key={item.id}
            href={item.listenUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative rounded-lg overflow-hidden aspect-square bg-surface-dark cursor-pointer ring-1 ring-white/5 hover:ring-primary/50 transition-all shadow-lg hover:shadow-[0_0_12px_rgba(40,170,226,0.15)]"
          >
            <div
              className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url("${item.cover}")` }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <span className="text-primary text-3xl drop-shadow-md">▶</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-black/90 via-black/60 to-transparent z-20">
              <p className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-[9px] font-medium text-white/70 truncate uppercase tracking-wide">
                {item.artist}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
