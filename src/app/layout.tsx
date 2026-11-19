import type { Metadata } from "next"
import { ThemeProvider } from "../components/ThemeProvider"

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
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="font-sans antialiased">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          {children}
        </body>
      </html>
    </ThemeProvider>
  )
}
