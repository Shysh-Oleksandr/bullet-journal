import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Spline_Sans_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { AppProviders } from "@/providers/AppProviders";

import "@blocknote/mantine/style.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-spline-mono",
});

/** Warm amber accent ramp (index 6 ≈ --accent #d8a657). */
const amber: [
  string, string, string, string, string,
  string, string, string, string, string,
] = [
  "#fcf5e6",
  "#f3e6c8",
  "#ead3a3",
  "#e2c07d",
  "#dbb05f",
  "#d8a657",
  "#d8a657",
  "#c2913f",
  "#a87b30",
  "#8d6522",
];

/** Warm dark ramp mirroring the Direction D surfaces. */
const dark: [
  string, string, string, string, string,
  string, string, string, string, string,
] = [
  "#ece3d4",
  "#cdc3b2",
  "#a89c89",
  "#6f6557",
  "#352f28",
  "#2c261f",
  "#241f19",
  "#1b1714",
  "#161310",
  "#100d0b",
];

const theme = createTheme({
  primaryColor: "amber",
  primaryShade: { light: 6, dark: 6 },
  colors: { amber, dark },
  defaultRadius: "md",
  fontFamily: "var(--font-hanken), system-ui, sans-serif",
  fontFamilyMonospace: "var(--font-spline-mono), ui-monospace, monospace",
  headings: {
    fontFamily: "var(--font-newsreader), Georgia, serif",
  },
});

export const metadata: Metadata = {
  title: "The Journal",
  description: "A warm, personal journaling PWA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      data-mantine-color-scheme="dark"
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body
        className={`antialiased ${newsreader.variable} ${hanken.variable} ${splineMono.variable}`}
        suppressHydrationWarning
      >
        <MantineProvider forceColorScheme="dark" theme={theme}>
          <AppProviders>{children}</AppProviders>
          <Toaster
            theme="dark"
            position="top-right"
            duration={1500}
            toastOptions={{
              style: {
                background: "var(--surface)",
                border: "1px solid var(--line)",
                color: "var(--text)",
                fontFamily: "var(--font-hanken), system-ui, sans-serif",
              },
            }}
          />
        </MantineProvider>
      </body>
    </html>
  );
}
