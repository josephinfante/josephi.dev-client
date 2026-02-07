import { useEffect, useMemo, useState } from 'react';
import type { SteamHistoryItem, SteamPresence, SteamRecentItem } from '@/hooks/use-stream';
import { formatSeconds } from '@/utils/music';

type Props = {
  steam: SteamPresence | null;
  history: SteamHistoryItem[];
  recent: SteamRecentItem[];
  isLoading: boolean;
};

const isMediaVideo = (url?: string | null) => Boolean(url && url.toLowerCase().endsWith('.webm'));

const isImageUrl = (url?: string | null) =>
  Boolean(
    url &&
    (url.toLowerCase().endsWith('.png') ||
      url.toLowerCase().endsWith('.jpg') ||
      url.toLowerCase().endsWith('.jpeg') ||
      url.toLowerCase().endsWith('.webp') ||
      url.toLowerCase().endsWith('.gif')),
  );

const getStatusCopy = (state?: SteamPresence['state']) => {
  switch (state) {
    case 'PLAYING':
      return { label: 'Playing now', dot: 'bg-emerald-400' };
    case 'ONLINE_IDLE':
      return { label: 'Online · Idle', dot: 'bg-amber-400' };
    case 'ONLINE':
      return { label: 'Online', dot: 'bg-emerald-400' };
    case 'OFFLINE':
      return { label: 'Offline', dot: 'bg-slate-500' };
    default:
      return { label: 'Unknown', dot: 'bg-slate-500' };
  }
};

const getSessionLabel = (steam: SteamPresence | null) => {
  if (!steam?.session) return '--:--';
  if (steam.session.elapsedLabel) return steam.session.elapsedLabel;
  if (Number.isFinite(steam.session.elapsedMs)) {
    return formatSeconds(Math.round(steam.session.elapsedMs / 1000));
  }
  return '--:--';
};

const getLastSessionLabel = (history: SteamHistoryItem[]) => {
  if (!history.length) return null;
  const last = history[0];
  if (last.durationLabel) return last.durationLabel;
  if (Number.isFinite(last.durationMs)) {
    return formatSeconds(Math.round(last.durationMs / 1000));
  }
  return null;
};

export const SteamWidget = ({ steam, history, recent, isLoading }: Props) => {
  const profile = steam?.profile;
  const status = getStatusCopy(steam?.state);
  const backgroundUrl = profile?.backgroundLarge ?? profile?.backgroundSmall ?? null;
  const avatarUrl = isImageUrl(profile?.profileUrl)
    ? profile?.profileUrl
    : (profile?.avatar ?? profile?.profileUrl ?? '');
  const frameUrl = profile?.frameUrl ?? null;
  const showFrameVideo = isMediaVideo(frameUrl);
  const showBackgroundVideo = isMediaVideo(backgroundUrl);
  const showBackgroundImage = isImageUrl(backgroundUrl);
  const sessionLabel = getSessionLabel(steam);
  const isPlaying = steam?.state === 'PLAYING' && Boolean(steam?.game);
  const lastSessionLabel = useMemo(() => getLastSessionLabel(history), [history]);
  const [liveSeconds, setLiveSeconds] = useState<number | null>(null);

  const baseElapsedMs = useMemo(() => {
    if (!steam?.session) return null;
    if (Number.isFinite(steam.session.elapsedMs)) return steam.session.elapsedMs;
    if (Number.isFinite(steam.session.startedAt)) {
      return Math.max(0, Date.now() - steam.session.startedAt);
    }
    return null;
  }, [steam?.session]);

  useEffect(() => {
    if (!steam?.session || baseElapsedMs === null) {
      setLiveSeconds(null);
      return;
    }

    const startedAt = steam.session.startedAt ?? null;
    const baseEpoch = Date.now();

    const tick = () => {
      const elapsedMs = startedAt
        ? Math.max(0, Date.now() - startedAt)
        : Math.max(0, baseElapsedMs + (Date.now() - baseEpoch));
      setLiveSeconds(Math.floor(elapsedMs / 1000));
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [steam?.session, baseElapsedMs]);

  const liveLabel = liveSeconds !== null ? formatSeconds(liveSeconds) : sessionLabel;
  const recentItems = recent.slice(0, 3);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 text-white shadow-2xl">
      <div className="absolute inset-0">
        {showBackgroundVideo ? (
          <video
            className="absolute inset-0 h-full w-full scale-105 object-cover blur-sm"
            src={backgroundUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : showBackgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
            style={{ backgroundImage: `url('${backgroundUrl}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800" />
        )}
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {isLoading ? (
        <div className="relative z-10 flex flex-1 items-center justify-center py-16 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-500 border-t-cyan-300" />
        </div>
      ) : steam && profile ? (
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-start justify-between px-6 pt-6">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-white">
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span>{status.label}</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
              Steam
            </div>
          </div>

          <div className="flex flex-col gap-6 px-6 pb-6 pt-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 md:h-24 md:w-24">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${profile.nickname} avatar`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    No Avatar
                  </div>
                )}
                {frameUrl ? (
                  showFrameVideo ? (
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={frameUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={frameUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  )
                ) : null}
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-bold text-white">{profile.nickname}</h3>
                <p className="text-sm text-white/80">{isPlaying ? 'In Game' : 'In Client'}</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  {isPlaying ? 'Playing Now' : 'Current Status'}
                </p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-2xl font-semibold text-white">
                      {steam.game?.name ?? 'No game running'}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {isPlaying ? 'Session Time' : 'Last Session'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">
                      {isPlaying ? liveLabel : (lastSessionLabel ?? '--:--')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-1 items-center justify-center py-16 text-white">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em]">
            Waiting for Steam presence
          </div>
        </div>
      )}

      {recentItems.length > 0 ? (
        <div className="relative z-20 grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 bg-black/40 backdrop-blur-md md:grid-cols-3 md:divide-x md:divide-y-0">
          {recentItems.map((item) => (
            <div
              key={item.appId}
              className="flex items-center gap-3 p-3 transition-colors hover:bg-white/5 md:px-5 md:py-4"
            >
              <div className="h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt={`${item.name} icon`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-white/60">
                    No Icon
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Recently played
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
