import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "../components/ThemeProvider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Rahat Md Mahadi Hasan | AI & Computer Engineering Student",
  description: "Portfolio of Rahat Md Mahadi Hasan - AI & Computer Engineering student at Dong-A University, full-stack developer, ML enthusiast, and open source contributor.",
  keywords: ["Rahat Md Mahadi Hasan", "portfolio", "AI", "Computer Engineering", "Machine Learning", "Full-Stack Developer", "Dong-A University"],
  authors: [{ name: "Rahat Md Mahadi Hasan" }],
  openGraph: {
    title: "Rahat Md Mahadi Hasan | AI & Computer Engineering Student",
    description: "Portfolio of Rahat Md Mahadi Hasan - AI & Computer Engineering student at Dong-A University.",
    type: "website",
    locale: "en_US",
    url: "https://rahat-portfolio.vercel.app",
    siteName: "Rahat Md Mahadi Hasan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahat Md Mahadi Hasan | AI & Computer Engineering Student",
    description: "Portfolio of Rahat Md Mahadi Hasan",
    creator: "@rahat-codes",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <html lang="en" className={inter.className} suppressHydrationWarning>
        <head />
        <body className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          {children}
        </body>
      </html>
    </ThemeProvider>
  )
}
