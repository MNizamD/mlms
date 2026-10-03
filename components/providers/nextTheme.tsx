"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import * as React from "react";

export function HerouiProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </NextThemeProvider>
    );
}
