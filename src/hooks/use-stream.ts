import { formatSeconds, parseProgress } from '@/utils/music';
import { useEffect, useMemo, useRef, useState } from 'react';

type MusicState = 'PLAYING' | 'PAUSED' | 'STOPPED';

export type Music = {
  title: string;
  artist: string;
  cover: string;
  progressPercent: number;
  progressText: string;
  state: MusicState;
  listenUrl: string | null;
  timestamp: number;
};

type PresenceInit = {
  music?: Music | null;
  steam?: SteamPresence | null;
  updatedAt?: number;
  history?: MusicHistoryItem[] | null;
};

export type MusicHistoryItem = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  listenUrl: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
};

export type SteamState = 'OFFLINE' | 'ONLINE_IDLE' | 'PLAYING' | 'ONLINE' | 'UNKNOWN';

export type SteamProfile = {
  steamId: string;
  nickname: string;
  profileUrl: string | null;
  avatar: string | null;
  frameUrl: string | null;
  backgroundSmall: string | null;
  backgroundLarge: string | null;
};

export type SteamGame = {
  appId: string;
  name: string;
  iconUrl: string | null;
};

export type SteamSession = {
  startedAt: number;
  elapsedMs: number;
  elapsedLabel: string;
};

export type SteamPresence = {
  state: SteamState;
  profile: SteamProfile;
  game: SteamGame | null;
  session: SteamSession | null;
  lastUpdatedAt: number;
};

export type SteamHistoryItem = {
  id: string;
  appId: string;
  name: string;
  iconUrl: string | null;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  durationMs: number;
  durationLabel: string;
};

export type SteamRecentItem = {
  appId: string;
  name: string;
  iconUrl: string | null;
  playtime2WeeksMs: number;
  playtimeForeverMs: number;
};

const API_BASE = (import.meta.env.API ?? '').trim().replace(/\/+$/, '');
const STREAM_URL = `${API_BASE}/presence/stream`;

export const useStream = () => {
  const [music, setMusic] = useState<Music | null>(null);
  const [steam, setSteam] = useState<SteamPresence | null>(null);
  const [steamHistory, setSteamHistory] = useState<SteamHistoryItem[]>([]);
  const [steamRecent, setSteamRecent] = useState<SteamRecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<MusicHistoryItem[]>([]);
  const [currentSec, setCurrentSec] = useState(0);
  const [totalSec, setTotalSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'live' | 'reconnecting'>(
    'connecting',
  );

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef(0);
  const totalSecRef = useRef(0);

  const applyMusicUpdate = (payload: Music | null | undefined) => {
    if (!payload) {
      setMusic(null);
      setIsPlaying(false);
      return;
    }

    setMusic(payload);
    setIsPlaying(payload.state === 'PLAYING');

    if (payload.progressText) {
      const { current, total } = parseProgress(payload.progressText);
      setCurrentSec(current);
      setTotalSec(total);
    } else if (totalSecRef.current > 0 && Number.isFinite(payload.progressPercent)) {
      setCurrentSec(Math.round((payload.progressPercent / 100) * totalSecRef.current));
    }
  };

  useEffect(() => {
    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setConnectionState(reconnectAttemptRef.current > 0 ? 'reconnecting' : 'connecting');

      const source = new EventSource(STREAM_URL);
      eventSourceRef.current = source;

      source.addEventListener('open', () => {
        setConnectionState('live');
        reconnectAttemptRef.current = 0;
      });

      source.addEventListener('presence.init', (event) => {
        setIsLoading(false);
        try {
          const data = JSON.parse((event as MessageEvent).data) as PresenceInit;
          applyMusicUpdate(data.music ?? null);
          setSteam(data.steam ?? null);
          if (Array.isArray(data.history)) {
            setHistory(data.history);
          }
        } catch {
          setMusic(null);
          setSteam(null);
        }
      });

      source.addEventListener('music.updated', (event) => {
        setIsLoading(false);
        try {
          const data = JSON.parse((event as MessageEvent).data) as Music;
          applyMusicUpdate(data);
        } catch {
          setMusic(null);
        }
      });

      source.addEventListener('steam.updated', (event) => {
        setIsLoading(false);
        try {
          const data = JSON.parse((event as MessageEvent).data) as SteamPresence;
          setSteam(data ?? null);
        } catch {
          setSteam(null);
        }
      });

      source.addEventListener('steam.history.updated', (event) => {
        setIsLoading(false);
        try {
          const data = JSON.parse((event as MessageEvent).data) as SteamHistoryItem[];
          if (Array.isArray(data)) {
            setSteamHistory(data);
          }
        } catch {
          setSteamHistory([]);
        }
      });

      source.addEventListener('steam.recent.updated', (event) => {
        setIsLoading(false);
        try {
          const data = JSON.parse((event as MessageEvent).data) as SteamRecentItem[];
          if (Array.isArray(data)) {
            setSteamRecent(data);
          }
        } catch {
          setSteamRecent([]);
        }
      });

      source.addEventListener('music.history.updated', (event) => {
        setIsLoading(false);
        try {
          const data = JSON.parse((event as MessageEvent).data) as MusicHistoryItem[];
          if (Array.isArray(data)) {
            setHistory(data);
          }
        } catch {
          setHistory([]);
        }
      });

      source.addEventListener('error', () => {
        setConnectionState('reconnecting');
        source.close();
        if (reconnectTimeoutRef.current) {
          return;
        }

        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 10000);
        reconnectAttemptRef.current += 1;
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, delay);
      });
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    totalSecRef.current = totalSec;
  }, [totalSec]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentSec((prev) => {
        if (totalSec > 0 && prev >= totalSec) {
          return totalSec;
        }
        return prev + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, totalSec]);

  const progressPercent = useMemo(() => {
    if (totalSec > 0) {
      return Math.min(100, (currentSec / totalSec) * 100);
    }
    if (music && Number.isFinite(music.progressPercent)) {
      return Math.min(100, Math.max(0, music.progressPercent));
    }
    return 0;
  }, [currentSec, totalSec, music]);

  const timeLabel =
    totalSec > 0
      ? `${formatSeconds(currentSec)} / ${formatSeconds(totalSec)}`
      : (music?.progressText ?? '--:--');

  return {
    music,
    steam,
    steamHistory,
    steamRecent,
    isLoading,
    history,
    currentSec,
    totalSec,
    isPlaying,
    progressPercent,
    timeLabel,
    connectionState,
  };
};
