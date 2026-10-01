import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/NA-LOGO.webp";
import MagneticButton from "./MagneticButton";
import { FiMoon, FiSun, FiMenu, FiX, FiArrowUpRight } from "react-icons/fi";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
  { label: "Play", href: "#game" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUltraDark, setIsUltraDark] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 25);

      // Calculate scroll progress percentage
      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        const progress = (scrollY / winHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // Determine active section
      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      const scrollPosition = scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newMode = !isUltraDark;
    setIsUltraDark(newMode);
    if (newMode) {
      document.documentElement.classList.add("ultra-dark");
    } else {
      document.documentElement.classList.remove("ultra-dark");
    }
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const topOffset = 75;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(item.href);
    if (element) {
      const topOffset = 75;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400 transition-all duration-75 ease-out shadow-[0_0_10px_#22d3ee]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#060913]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg shadow-black/40"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, "#about")}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label="Naday Abbas Portfolio Home"
          >
            <div className="relative">
              <img
                src={logo}
                alt="NA Logo"
                width={38}
                height={38}
                className="w-9 h-9 object-contain rounded-lg border border-white/10 group-hover:border-cyan-400/50 transition-colors"
              />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white flex items-center">
              Naday<span className="text-cyan-400 ml-0.5">.</span>
            </span>
          </a>

          {/* Desktop Nav Links with Active Indicator */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0a0f1d]/80 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner shadow-white/5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative text-sm font-medium px-3.5 py-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Actions (Theme toggle + Hire Me CTA) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title={isUltraDark ? "Switch to Deep Navy Dark" : "Switch to Ultra Black"}
              aria-label="Toggle theme contrast"
            >
              {isUltraDark ? (
                <FiSun className="w-4 h-4 text-cyan-400" />
              ) : (
                <FiMoon className="w-4 h-4 text-violet-400" />
              )}
            </button>

            <MagneticButton
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-cyan-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-cyan-500/30 transition-all group border border-violet-400/30"
            >
              <span>Hire me</span>
              <FiArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticButton>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10"
              aria-label="Toggle theme"
            >
              {isUltraDark ? <FiSun className="w-4 h-4 text-cyan-400" /> : <FiMoon className="w-4 h-4 text-violet-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#060913]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6"
            >
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.href.substring(1);
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`text-base font-medium py-2.5 px-3 rounded-xl border transition-colors ${
                        isActive
                          ? "text-cyan-300 bg-violet-600/20 border-violet-500/30"
                          : "text-zinc-300 hover:text-white border-transparent"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
                <div className="pt-3">
                  <a
                    href="#contact"
                    onClick={(e) => scrollToSection(e, "#contact")}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium"
                  >
                    Hire me
                    <FiArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
