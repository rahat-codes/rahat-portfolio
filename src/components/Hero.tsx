import { personalInfo } from "../data/personal"

export default function Hero() {
  return (
    <section
      id="home"
      className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-6 pb-20 pt-32 sm:px-8 lg:px-12"
    >
      <h1 className="max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
        {personalInfo.name}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {personalInfo.title} at Tongmyong University in {personalInfo.location}. I build practical solutions across machine learning, full-stack development, and embedded systems.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        <a href="#projects" className="text-base font-semibold text-primary transition-colors hover:text-foreground">
          View projects
        </a>
        <a href="#contact" className="text-base font-semibold text-primary transition-colors hover:text-foreground">
          Get in touch
        </a>
      </div>
    </section>
  )
}
