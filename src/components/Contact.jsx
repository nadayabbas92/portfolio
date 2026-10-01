import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAL_INFO } from "../constants";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCopy,
  FiCheck,
  FiSend,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const EarthGlobe = lazy(() => import("./EarthGlobe"));

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    botcheck: "",
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" }); // idle, loading, success, error

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      errors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (!isValid) return;

    // Honeypot spam check
    if (formData.botcheck) {
      setStatus({ state: "error", message: "Spam submission detected." });
      return;
    }

    setStatus({ state: "loading", message: "Sending your message..." });

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    try {
      if (accessKey && accessKey !== "your_web3forms_access_key_here") {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            from_name: "Portfolio Contact Form",
          }),
        });

        const data = await response.json();
        if (data.success) {
          setStatus({
            state: "success",
            message: "Thank you! Your message has been sent successfully to Naday.",
          });
          setFormData({ name: "", email: "", subject: "", message: "", botcheck: "" });
          setTouched({});
        } else {
          throw new Error(data.message || "Failed to send message");
        }
      } else {
        // Simulated submission when key is pending configuration
        await new Promise((resolve) => setTimeout(resolve, 900));
        setStatus({
          state: "success",
          message:
            "Thank you! Message processed. (To receive live email alerts in your inbox, set VITE_WEB3FORMS_ACCESS_KEY in your environment).",
        });
        setFormData({ name: "", email: "", subject: "", message: "", botcheck: "" });
        setTouched({});
      }
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err.message || "Something went wrong while sending. Please email nadaycoding@gmail.com directly.",
      });
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background radial aurora */}
      <div className="absolute bottom-0 left-1/3 w-[550px] h-[350px] bg-gradient-to-r from-violet-600/10 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d1428] border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Get in Touch</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Let's Build Together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-zinc-300"
          >
            Have a project in mind, open frontend roles, or want to connect? Reach out below.
          </motion.p>
        </div>

        {/* Two-Column Layout: Left (Interactive 3D Earth) + Right (Contact Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Polished Interactive 3D Earth Globe + Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* 3D Earth Globe Container */}
            <div className="rounded-3xl bg-[#0d1428]/80 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 min-h-[360px] sm:min-h-[400px] flex flex-col items-center justify-center group">
              {/* Soft radial glow behind globe */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,rgba(139,92,246,0.08)_50%,transparent_75%)] pointer-events-none" />

              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm font-mono">
                    Loading 3D Globe...
                  </div>
                }
              >
                <EarthGlobe />
              </Suspense>
            </div>

            {/* Quick Contact & Availability Strip */}
            <div className="p-6 rounded-3xl bg-[#0d1428]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
              {/* Direct email card with copy button */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                      Direct Email
                    </p>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-xs sm:text-sm font-medium text-white hover:text-cyan-300 transition-colors truncate block"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
                  title="Copy Email"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <FiCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <FiCopy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Social Channels & Status Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={PERSONAL_INFO.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="p-2.5 rounded-xl bg-black/40 hover:bg-violet-600/25 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={PERSONAL_INFO.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="p-2.5 rounded-xl bg-black/40 hover:bg-violet-600/25 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                  <a
                    href={PERSONAL_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="p-2.5 rounded-xl bg-black/40 hover:bg-violet-600/25 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for work</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0d1428]/80 border border-white/10 backdrop-blur-xl shadow-2xl relative h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Send a Message
                </h3>
                <p className="text-sm text-zinc-300 mb-8">
                  Fill in the details below and I'll get back to you promptly.
                </p>

                {/* Status Toast Alert */}
                <AnimatePresence>
                  {status.state === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-start gap-3 shadow-lg"
                    >
                      <FiCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                      <p>{status.message}</p>
                    </motion.div>
                  )}

                  {status.state === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3 shadow-lg"
                    >
                      <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                      <p>{status.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Honeypot anti-spam field */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setFormData({ ...formData, botcheck: e.target.checked ? "spam" : "" })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-2"
                      >
                        Your Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Alex Johnson"
                        disabled={status.state === "loading"}
                        className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white placeholder-zinc-500 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                          touched.name && errors.name
                            ? "border-rose-500/70 focus:border-rose-500"
                            : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                        }`}
                      />
                      {touched.name && errors.name && (
                        <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-2"
                      >
                        Your Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="alex@example.com"
                        disabled={status.state === "loading"}
                        className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white placeholder-zinc-500 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                          touched.email && errors.email
                            ? "border-rose-500/70 focus:border-rose-500"
                            : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject field */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-2"
                    >
                      Subject <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Project Inquiry / Frontend Role"
                      disabled={status.state === "loading"}
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white placeholder-zinc-500 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                        touched.subject && errors.subject
                          ? "border-rose-500/70 focus:border-rose-500"
                          : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                      }`}
                    />
                    {touched.subject && errors.subject && (
                      <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                        <FiAlertCircle className="w-3.5 h-3.5" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message field with Character Counter */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="message"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold"
                      >
                        Message <span className="text-cyan-400">*</span>
                      </label>
                      <span
                        className={`text-xs font-mono font-medium ${
                          formData.message.length > 900
                            ? "text-amber-400"
                            : "text-zinc-400"
                        }`}
                      >
                        {formData.message.length} / 1000
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      maxLength={1000}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell me about your project goals, timelines, or role details..."
                      disabled={status.state === "loading"}
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white placeholder-zinc-500 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none ${
                        touched.message && errors.message
                          ? "border-rose-500/70 focus:border-rose-500"
                          : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                      }`}
                    />
                    {touched.message && errors.message && (
                      <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                        <FiAlertCircle className="w-3.5 h-3.5" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button with Loading State */}
                  <button
                    type="submit"
                    disabled={status.state === "loading"}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-lg shadow-violet-600/30 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
                  >
                    {status.state === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FiSend className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
