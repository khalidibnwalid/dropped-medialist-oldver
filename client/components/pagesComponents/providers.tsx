import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Only for development

const defaultQueryConfig = { staleTime: 60*1000 } // 1 minute

const queryClient = new QueryClient({
  defaultOptions: { queries: defaultQueryConfig },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider attribute="class" defaultTheme="dark" storageKey='theme' disableTransitionOnChange>
          {children}
        </NextThemesProvider>
        <ReactQueryDevtools /> {/* Only for development*/}
      </QueryClientProvider>
    </NextUIProvider>
  )
}