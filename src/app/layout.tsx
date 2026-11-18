export const metadata = {
  title: "Rahat Md Mahadi Hasan | AI & Computer Engineering Student",
  description: "Portfolio of Rahat Md Mahadi Hasan - AI & Computer Engineering student at Dong-A University, full-stack developer, ML enthusiast, and open source contributor.",
  keywords: ["Rahat Md Mahadi Hasan", "portfolio", "AI", "Computer Engineering", "Machine Learning", "Full-Stack Developer", "Dong-A University"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased">{children}</body>
    </html>
  )
}
