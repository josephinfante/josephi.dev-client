import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useGitHubContributions } from '@/hooks/use-gitHub-contributions';

const COLORS = ['bg-[#ebedf0]', 'bg-[#9be9a8]', 'bg-[#40c463]', 'bg-[#30a14e]', 'bg-[#216e39]'];

const getLevel = (count: number, max: number) => {
  if (count <= 0) return 0;
  if (max <= 0) return 1;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
};

const getOrdinal = (day: number) => {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

const formatTooltipDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = getOrdinal(date.getDate());
  return `${month} ${day}`;
};

const getWeekdayLabel = (index: number) => {
  switch (index) {
    case 1:
      return 'Mon';
    case 3:
      return 'Wed';
    case 5:
      return 'Fri';
    default:
      return '';
  }
};

export const GitHubWidget = () => {
  const { total, days, isLoading, error } = useGitHubContributions();
  const maxCount = useMemo(() => days.reduce((max, day) => Math.max(max, day.count), 0), [days]);
  const { monthLabels, weekCount } = useMemo(() => {
    if (!days.length) {
      return {
        monthLabels: [] as { label: string; span: number }[],
        weekCount: 0,
      };
    }

    const totalWeeks = Math.ceil(days.length / 7);
    const weekMonths = Array.from({ length: totalWeeks }, () => '');
    let lastMonth = '';

    days.forEach((day, index) => {
      const date = new Date(day.date);
      if (Number.isNaN(date.getTime())) return;
      const month = date.toLocaleString('en-US', { month: 'short' });
      if (month !== lastMonth) {
        lastMonth = month;
      }
      const weekIndex = Math.floor(index / 7);
      if (!weekMonths[weekIndex]) {
        weekMonths[weekIndex] = month;
      }
    });

    const spans: { label: string; span: number }[] = [];
    let current = weekMonths[0] ?? '';
    let span = 0;
    weekMonths.forEach((label) => {
      if (label === current) {
        span += 1;
        return;
      }
      spans.push({ label: current, span });
      current = label;
      span = 1;
    });
    if (span > 0) {
      spans.push({ label: current, span });
    }

    return { monthLabels: spans, weekCount: totalWeeks };
  }, [days]);

  return (
    <div className="relative w-full h-full max-w-3xl rounded-2xl border border-white/10 bg-[#f7f8fa] dark:bg-[#0c1116] p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              GitHub Activity
            </h2>
            <a
              href="https://github.com/josephinfante"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub profile"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/5 text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto pb-2 [--cell-size:10px] [--cell-gap:2px] [--label-width:2.25rem] md:[--cell-size:10px] md:[--cell-gap:2px] md:[--label-width:2.5rem]">
        <div className="grid gap-2">
          {weekCount > 0 ? (
            <div
              className="grid items-center gap-2"
              style={{ gridTemplateColumns: 'var(--label-width) 1fr' }}
            >
              <div />
              <div
                className="grid w-max min-w-full gap-(--cell-gap)"
                style={{
                  gridTemplateColumns: `repeat(${weekCount}, var(--cell-size))`,
                }}
              >
                {monthLabels.map((label, idx) => (
                  <div
                    key={`month-${idx}`}
                    className="h-4 text-[11px] font-medium text-foreground/60"
                    style={{ gridColumn: `span ${label.span}` }}
                  >
                    {label.label}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-4" />
          )}
          <div className="grid gap-2" style={{ gridTemplateColumns: 'var(--label-width) 1fr' }}>
            <div
              className="grid gap-(--cell-gap)"
              style={{ gridTemplateRows: 'repeat(7, var(--cell-size))' }}
            >
              {Array.from({ length: 7 }).map((_, idx) => (
                <span
                  key={`weekday-${idx}`}
                  className="flex h-(--cell-size) items-center text-[11px] leading-none text-foreground/60"
                >
                  {getWeekdayLabel(idx)}
                </span>
              ))}
            </div>
            <div className="grid w-max min-w-full grid-flow-col grid-rows-7 auto-cols-(--cell-size) gap-(--cell-gap)">
              {isLoading
                ? Array.from({ length: 140 }).map((_, idx) => (
                    <div
                      key={`loading-${idx}`}
                      className="h-(--cell-size) w-(--cell-size) rounded-[2px] bg-white/5"
                    />
                  ))
                : days.map((day) => {
                    const level = getLevel(day.count, maxCount);
                    const colorClass = COLORS[level] ?? COLORS[0];
                    const opacityClass = level === 0 ? 'opacity-100' : 'opacity-100';
                    const label = `${day.count} contribution${
                      day.count === 1 ? '' : 's'
                    } on ${formatTooltipDate(day.date)}`;
                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-(--cell-size) w-(--cell-size) rounded-[2px] ${colorClass} ${opacityClass}`}
                            aria-label={label}
                          />
                        </TooltipTrigger>
                        <TooltipContent sideOffset={6}>
                          <span className="text-xs">{label}</span>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-white/10" />

      <div className="mt-4 flex flex-col gap-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {total.toLocaleString('en-US')}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9be9a8]">
            Total Contributions
          </span>
        </div>
        {error ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
            {error}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground/60">Less</span>
            <div className="flex gap-1">
              <div className="h-2.5 w-2.5 rounded-[2px] bg-[#ebedf0]" />
              <div className="h-2.5 w-2.5 rounded-[2px] bg-[#9be9a8]" />
              <div className="h-2.5 w-2.5 rounded-[2px] bg-[#40c463]" />
              <div className="h-2.5 w-2.5 rounded-[2px] bg-[#30a14e]" />
              <div className="h-2.5 w-2.5 rounded-[2px] bg-[#216e39]" />
            </div>
            <span className="font-medium text-foreground/60">More</span>
          </div>
        )}
      </div>
    </div>
  );
};
