import { ThemeProvider } from 'next-themes';
export default function ThemeProv({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme: 'light' | 'dark';
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
