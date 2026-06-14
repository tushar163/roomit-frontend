"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export function AppProviders({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toast.Provider placement="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}