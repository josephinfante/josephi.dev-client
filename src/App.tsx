import { ThemeToggle } from './components/theme/theme-toggle';
import { ThemeProvider } from './components/theme/theme.provider';
import { AboutMeWidget } from './components/widgets/about-me';
import { GitHubWidget } from './components/widgets/github-widget';
import { MusicWidget } from './components/widgets/music-widget';
import { RecentlyPlayedWidget } from './components/widgets/recently-played-widget';
import { SteamWidget } from './components/widgets/steam-widget';
import { useStream } from './hooks/use-stream';

export function App() {
  const stream = useStream();
  return (
    <ThemeProvider defaultTheme="system" storageKey="josephi.dev-ui-theme">
      <main className="min-h-screen px-4 py-10">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-primary opacity-25 blur-[120px]" />
        </div>

        <div className="my-6 mx-auto w-full flex items-center justify-center">
          <ThemeToggle />
        </div>
        <section className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 auto-rows-auto gap-2 lg:grid-cols-6 lg:grid-rows-4 lg:auto-rows-fr">
            <div className="order-3 h-full lg:order-0 lg:col-span-4 lg:row-span-2">
              <SteamWidget
                steam={stream.steam}
                history={stream.steamHistory}
                recent={stream.steamRecent}
                isLoading={stream.isLoading}
              />
            </div>
            <div className="order-2 h-full flex flex-col gap-4 lg:order-0 lg:col-span-2 lg:col-start-5 lg:row-span-2">
              <MusicWidget
                music={stream.music}
                isLoading={stream.isLoading}
                isPlaying={stream.isPlaying}
                progressPercent={stream.progressPercent}
                timeLabel={stream.timeLabel}
              />
              <RecentlyPlayedWidget items={stream.history} current={stream.music} />
            </div>
            <div className="order-1 h-full lg:order-0 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-3">
              <AboutMeWidget music={stream.music} steam={stream.steam} />
            </div>
            <div className="order-4 h-full lg:order-0 lg:col-span-4 lg:col-start-3 lg:row-span-2 lg:row-start-3">
              <GitHubWidget />
            </div>
          </div>
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
