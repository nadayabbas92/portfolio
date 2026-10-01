import { FiArrowUp } from "react-icons/fi";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import logo from "../assets/NA-LOGO.webp";
import { PERSONAL_INFO } from "../constants";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#04060c] py-10 relative overflow-hidden">
      {/* Subtle bottom ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[80px] bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-transparent blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Name and Brand Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="NA Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain rounded-md border border-white/15"
          />
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">
              Naday Abbas
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              Web Developer (Frontend, React)
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 rounded-xl bg-[#0d1428] hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <FaLinkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 rounded-xl bg-[#0d1428] hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <FaGithub className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="p-2 rounded-xl bg-[#0d1428] hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <FaInstagram className="w-4 h-4" />
          </a>
        </div>

        {/* Copyright & Back to Top */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400 font-mono">
            © {currentYear} Naday Abbas
          </span>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-[#0d1428] hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 border border-white/15 hover:border-cyan-400/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shadow-md group cursor-pointer"
            title="Back to Top"
            aria-label="Scroll back to top of page"
          >
            <FiArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
