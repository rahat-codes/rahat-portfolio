export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-800/50 pt-12 pb-8 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">RM</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Rahat<span className="text-accent-400">MH</span></span>
          </div>

          <div className="flex gap-6">
            <a
              href="https://github.com/rahat-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-accent-400 transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="mailto:mhr1760@gmail.com"
              className="text-white hover:text-accent-400 transition-colors"
              aria-label="Email"
            >
              Email
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rahat Md Mahadi Hasan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
