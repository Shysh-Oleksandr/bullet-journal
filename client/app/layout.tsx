import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import { Lato, Montserrat, Open_Sans, Poppins } from "next/font/google";

import { AppProviders } from "@/providers/AppProviders";

import "@blocknote/mantine/style.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import "./globals.css";

const theme = createTheme({
  primaryColor: "blue", // Options: red, teal, violet, etc.
});

export const metadata: Metadata = {
  title: "Bullet Journal",
  description: "Journaling and note-taking PWA",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        className={`antialiased ${lato.className}`}
        suppressHydrationWarning
      >
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <AppProviders>{children}</AppProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
