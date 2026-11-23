"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowUp, Sparkles, ExternalLink, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES (MATCHING 21st.dev MOTION FOOTER)
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  /* Fallback color tokens */
  --footer-fg: #0F172A;
  --footer-bg: #FFFFFF;
  --footer-primary: #6D28D9;
  --footer-secondary: #059669;
  --footer-border: #E2E8F0;

  /* Dynamic Variables using standard shadcn/tailwind tokens */
  --pill-bg-1: rgba(15, 23, 42, 0.03);
  --pill-bg-2: rgba(15, 23, 42, 0.01);
  --pill-shadow: rgba(15, 23, 42, 0.06);
  --pill-highlight: rgba(255, 255, 255, 0.9);
  --pill-inset-shadow: rgba(15, 23, 42, 0.04);
  --pill-border: rgba(226, 232, 240, 0.9);
  
  --pill-bg-1-hover: rgba(109, 40, 217, 0.08);
  --pill-bg-2-hover: rgba(109, 40, 217, 0.03);
  --pill-border-hover: rgba(109, 40, 217, 0.35);
  --pill-shadow-hover: rgba(109, 40, 217, 0.15);
  --pill-highlight-hover: rgba(255, 255, 255, 1);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.85; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.4)); }
  15%, 45% { transform: scale(1.22); filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.7)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 35s linear infinite;
}

.animate-footer-scroll-marquee:hover {
  animation-play-state: paused;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 48px 48px;
  background-image: 
    linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(109, 40, 217, 0.12) 0%, 
    rgba(5, 150, 105, 0.08) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 25px -8px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 18px 35px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #0F172A;
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 21vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(15, 23, 42, 0.06);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.06) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic / Slate Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #0F172A 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 18px rgba(109, 40, 217, 0.08));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (GSAP Context)
// -------------------------------------------------------------------------
export const MagneticButton = React.forwardRef(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.1,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("cursor-pointer select-none", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MARQUEE BANNER
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-10 px-6 shrink-0">
    <span className="flex items-center gap-2 font-extrabold text-white">
      <img src="/images/polinela-logo.png" alt="POLINELA" className="h-4 w-4 object-contain" />
      SCHOLARHUB POLINELA
    </span>
    <span className="text-primary font-bold">✦</span>
    <span>PORTAL BEASISWA RESMI</span>
    <span className="text-secondary font-bold">✦</span>
    <span>BEASISWA PRESTASI & BANTUAN BIAYA</span>
    <span className="text-primary font-bold">✦</span>
    <span>POLITEKNIK NEGERI LAMPUNG</span>
    <span className="text-secondary font-bold">✦</span>
    <span>TRANSPARAN & TEPAT SASARAN</span>
    <span className="text-primary font-bold">✦</span>
    <span>TEMUKAN BEASISWA IMPIANMU</span>
    <span className="text-secondary font-bold">✦</span>
  </div>
);

// -------------------------------------------------------------------------
// 4. MAIN CINEMATIC FOOTER COMPONENT
// -------------------------------------------------------------------------
export function CinematicFooter({ settings = {} }) {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Background Parallax
      if (giantTextRef.current) {
        gsap.fromTo(
          giantTextRef.current,
          { y: "8vh", scale: 0.85, opacity: 0 },
          {
            y: "0vh",
            scale: 1,
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 85%",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }

      // Staggered Content Reveal
      if (headingRef.current && linksRef.current) {
        gsap.fromTo(
          [headingRef.current, linksRef.current],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 60%",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();
  const campusName = settings.nama_situs || "ScholarHub POLINELA";
  const copyrightText = settings.teks_footer || "Politeknik Negeri Lampung";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        className="relative w-full min-h-[580px] md:min-h-[640px] bg-slate-900 text-slate-100 cinematic-footer-wrapper overflow-hidden"
      >
        <footer className="relative flex flex-col justify-between overflow-hidden py-10 px-4 sm:px-6 lg:px-8 w-full min-h-[580px] md:min-h-[640px]">
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[90px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none opacity-20" />

          {/* Giant background text (Watermark) */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none text-white/5 font-black uppercase tracking-tight"
          >
            POLINELA
          </div>

          {/* 1. Sleek Continuous Marquee Banner (Top) */}
          <div className="relative w-full overflow-hidden border-y border-white/10 bg-slate-950/60 backdrop-blur-md py-3.5 z-10 shadow-lg -mx-4 sm:-mx-6 lg:-mx-8 px-4">
            <div className="flex w-max animate-footer-scroll-marquee text-xs font-bold tracking-[0.25em] text-slate-300 uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 my-8 md:my-12 w-full max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-purple-300 mb-6 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Portal Beasiswa Masa Depan</span>
            </div>

            <h2
              ref={headingRef}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight"
            >
              Siap Menemukan Beasiswa Impianmu?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
              Akses puluhan informasi beasiswa terverifikasi, jadwal pendaftaran, dan persyaratan lengkap khusus mahasiswa Politeknik Negeri Lampung.
            </p>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-5 w-full">
              {/* Primary Action Pills */}
              <div className="flex flex-wrap justify-center gap-3.5 w-full">
                <MagneticButton
                  as={Link}
                  to="/"
                  className="footer-glass-pill px-7 py-3.5 rounded-full text-white font-bold text-sm flex items-center gap-2.5 group bg-white/10 hover:bg-primary/20 border-white/20"
                >
                  <GraduationCap className="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  <span>Jelajahi Beasiswa</span>
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="https://polinela.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-7 py-3.5 rounded-full text-white font-bold text-sm flex items-center gap-2.5 group bg-white/10 hover:bg-emerald-600/20 border-white/20"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  <span>Website Utama POLINELA</span>
                </MagneticButton>
              </div>

              {/* Secondary Navigation Links */}
              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 w-full mt-2">
                <MagneticButton
                  as={Link}
                  to="/about"
                  className="footer-glass-pill px-5 py-2.5 rounded-full text-slate-300 font-medium text-xs sm:text-sm hover:text-white bg-white/5 border-white/10"
                >
                  Tentang Portal
                </MagneticButton>
                <MagneticButton
                  as={Link}
                  to="/login"
                  className="footer-glass-pill px-5 py-2.5 rounded-full text-slate-300 font-medium text-xs sm:text-sm hover:text-white bg-white/5 border-white/10"
                >
                  Portal Admin
                </MagneticButton>
                {settings.url_instagram && (
                  <MagneticButton
                    as="a"
                    href={settings.url_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-glass-pill px-5 py-2.5 rounded-full text-slate-300 font-medium text-xs sm:text-sm hover:text-white bg-white/5 border-white/10"
                  >
                    Instagram Resmi
                  </MagneticButton>
                )}
                {settings.email_kontak && (
                  <MagneticButton
                    as="a"
                    href={`mailto:${settings.email_kontak}`}
                    className="footer-glass-pill px-5 py-2.5 rounded-full text-slate-300 font-medium text-xs sm:text-sm hover:text-white bg-white/5 border-white/10"
                  >
                    Kontak Bantuan
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
            {/* Copyright */}
            <div className="font-medium tracking-wide order-2 md:order-1 text-center md:text-left">
              © {currentYear} {copyrightText}. Seluruh Hak Cipta Dilindungi.
            </div>

            {/* "Made with Love" Badge */}
            <div className="footer-glass-pill px-5 py-2 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/15 bg-white/5">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300">
                Dikembangkan untuk
              </span>
              <span className="animate-footer-heartbeat text-sm text-red-500">❤</span>
              <span className="text-white font-bold text-xs sm:text-sm">POLINELA</span>
            </div>

            {/* Back to top Button */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full footer-glass-pill flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border-white/15 order-3 shadow-md"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
