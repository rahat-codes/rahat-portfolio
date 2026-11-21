import type { Metadata } from "next"
import { JetBrains_Mono, Manrope } from "next/font/google"
import { ThemeProvider } from "../components/ThemeProvider"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://rahat-portfolio.vercel.app"),
  title: "Rahat Md Mahadi Hasan | AI & Computer Engineering Student",
  description: "Portfolio of Rahat Md Mahadi Hasan - AI & Computer Engineering student at Tongmyong University, full-stack developer, ML enthusiast, and open source contributor.",
  keywords: ["Rahat Md Mahadi Hasan", "portfolio", "AI", "Computer Engineering", "Machine Learning", "Full-Stack Developer", "Tongmyong University"],
  authors: [{ name: "Rahat Md Mahadi Hasan" }],
  openGraph: {
    title: "Rahat Md Mahadi Hasan | AI & Computer Engineering Student",
    description: "Portfolio of Rahat Md Mahadi Hasan - AI & Computer Engineering student at Tongmyong University.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body className={`${manrope.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
