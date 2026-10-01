import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import PageIntro from "./components/PageIntro";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Technologies from "./components/Technologies";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import BugRunner from "./components/BugRunner";
import WordmarkSection from "./components/WordmarkSection";
import Footer from "./components/Footer";
import AmbientBackground from "./components/AmbientBackground";

export default function App() {
  return (
    <SmoothScroll>
      {/* Intro transition under 1.2s */}
      <PageIntro />

      {/* Desktop-only custom cursor (safely hidden until first movement) */}
      <CustomCursor />

      <div className="min-h-screen bg-[#060913] text-[#f1f5f9] antialiased selection:bg-violet-600 selection:text-white relative">
        {/* Subtle animated ambient background with celestial particles and neural threads */}
        <AmbientBackground />

        {/* Subtle neural network grid overlay */}
        <div
          className="fixed inset-0 bg-neural-pattern opacity-60 pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Subtle film-grain noise texture */}
        <div
          className="fixed inset-0 bg-film-grain opacity-40 pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Soft Aurora / Mesh Gradient Glows */}
        <div
          className="fixed top-0 left-1/3 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-600/12 via-indigo-600/8 to-transparent blur-[140px] pointer-events-none z-0"
          aria-hidden="true"
        />
        <div
          className="fixed top-1/4 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent blur-[130px] pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Sticky Blurred Navigation with Scroll Progress */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="relative z-10">
          <Hero />
          <Technologies />
          <Projects />
          <Education />
          <Contact />
          <BugRunner />
          <WordmarkSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
