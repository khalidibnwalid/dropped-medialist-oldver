import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Only for development
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from './authProvider';

const defaultQueryConfig = { staleTime: 60 * 1000 } // 1 minute

export const queryClient = new QueryClient({
  defaultOptions: { queries: defaultQueryConfig },
})

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark" storageKey='theme' disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
          <ReactQueryDevtools /> {/* Only for development*/}
        </QueryClientProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}