import { ThemeToggle } from "./components/theme/theme-toggle";
import { ThemeProvider } from "./components/theme/theme.provider";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="josephi.dev-ui-theme">
      <main>
        <p>HOLA MUNDO</p>
        <ThemeToggle />
      </main>
    </ThemeProvider>
  );
}

export default App;
