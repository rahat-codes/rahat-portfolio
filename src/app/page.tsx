import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import About from "../components/About"
import Experience from "../components/Experience"
import Projects from "../components/Projects"
import Certifications from "../components/Certifications"
import Education from "../components/Education"
import Skills from "../components/Skills"
import Contact from "../components/Contact"

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-accent-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Certifications />
        <Education />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
