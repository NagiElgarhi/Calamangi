import { Video, Globe, Moon, Sun } from "lucide-react";
import { useState } from "react";
import VideoRecorderWidget from "./VideoRecorderWidget";
import Teleprompter from "./Teleprompter";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import InitiativeModal from "./InitiativeModal";
import AdminPanel from "./AdminPanel";
import talkToMeLogo from "../assets/images/talk_to_me_logo_1781000272914.png";

const HeartHeadphonesLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className={className}
    style={{ overflow: "visible" }}
  >
    <defs>
      <linearGradient id="gold-bright" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#422f08" />
        <stop offset="25%" stopColor="#AA7C11" />
        <stop offset="50%" stopColor="#FFF2CD" />
        <stop offset="75%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#422f08" />
        <animateTransform
          attributeName="gradientTransform"
          type="translate"
          from="-1 -1"
          to="1 1"
          dur="3s"
          repeatCount="indefinite"
        />
      </linearGradient>

      <linearGradient id="gold-body" x1="0%" y1="10%" x2="100%" y2="90%">
        <stop offset="0%" stopColor="#332204" />
        <stop offset="30%" stopColor="#AA7C11" />
        <stop offset="50%" stopColor="#FFF2CD" />
        <stop offset="70%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#332204" />
        <animateTransform
          attributeName="gradientTransform"
          type="translate"
          from="-1 -1"
          to="1 1"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </linearGradient>

      <linearGradient id="cushion" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1A1A1A" />
        <stop offset="50%" stopColor="#333333" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>

      <filter id="initiative-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="3"
          floodColor="#008080"
          floodOpacity="0.8"
        />
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="6"
          floodColor="#40e0d0"
          floodOpacity="0.5"
        />
      </filter>

      <filter id="heart-halo" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="4"
          floodColor="#40e0d0"
          floodOpacity="0.9"
        />
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="8"
          floodColor="#008080"
          floodOpacity="0.7"
        />
      </filter>

      <filter id="royal-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g>
      {/* White Heart with light halo of initiative color */}
      <path
        d="M 32 46 C 32 46, 16 30, 16 18 C 16 10, 23 6, 28 10 C 30 12, 32 14, 32 14 C 32 14, 34 12, 36 10 C 41 6, 48 10, 48 18 C 48 30, 32 46, 32 46 Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinejoin="round"
        style={{ transformOrigin: "32px 26px" }}
        transform="translate(0, -5) scale(0.66, 0.44)"
        filter="url(#heart-halo)"
      />

      <g filter="url(#royal-glow)">
        {/* Headphones (raised and widened to frame the heart) */}
        <g transform="translate(0, -16)">
          {/* Headphone Band */}
          <path
            d="M 6 32 C 6 4, 58 4, 58 32"
            fill="none"
            stroke="url(#gold-bright)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Headphone Band padding/leather */}
          <path
            d="M 8 30 C 8 10, 56 10, 56 30"
            fill="none"
            stroke="#222"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Band details */}
          <path
            d="M 12 20 L 16 17 M 52 20 L 48 17"
            stroke="url(#gold-body)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Headphones Earcups */}
          {/* Left Earcup */}
          <rect
            x="-2"
            y="26"
            width="12"
            height="22"
            rx="6"
            fill="url(#gold-body)"
          />
          <rect
            x="10"
            y="28"
            width="4"
            height="18"
            rx="2"
            fill="url(#cushion)"
          />
          {/* Left Cup details */}
          <path
            d="M 2 30 C 0 36, 0 40, 2 44"
            stroke="#111"
            strokeWidth="1"
            fill="none"
          />

          {/* Right Earcup */}
          <rect
            x="54"
            y="26"
            width="12"
            height="22"
            rx="6"
            fill="url(#gold-body)"
          />
          <rect
            x="50"
            y="28"
            width="4"
            height="18"
            rx="2"
            fill="url(#cushion)"
          />
          {/* Right Cup details */}
          <path
            d="M 62 30 C 64 36, 64 40, 62 44"
            stroke="#111"
            strokeWidth="1"
            fill="none"
          />

          {/* Screws/Hinges on Headband */}
          <circle
            cx="6"
            cy="30"
            r="3"
            fill="#1A1A1A"
            stroke="url(#gold-body)"
            strokeWidth="1"
          />
          <circle
            cx="58"
            cy="30"
            r="3"
            fill="#1A1A1A"
            stroke="url(#gold-body)"
            strokeWidth="1"
          />
        </g>

        {/* Golden Mic placed 5 pixels below the heart */}
        <g transform="translate(0, 48)">
          {/* Mic boom coming from the left earcup */}
          <path
            d="M 10 0 Q 15 15, 26 12"
            fill="none"
            stroke="url(#gold-bright)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Golden mic tip */}
          <rect
            x="25"
            y="9"
            width="10"
            height="6"
            rx="3"
            fill="#D4AF37"
            filter="url(#royal-glow)"
          />
          <line
            x1="28"
            y1="9"
            x2="28"
            y2="15"
            stroke="#332204"
            strokeWidth="1"
          />
          <line
            x1="31"
            y1="9"
            x2="31"
            y2="15"
            stroke="#332204"
            strokeWidth="1"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default function SaaSLayout() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayTheme, setDayTheme] = useState("#fdfdf9");
  const [darkTheme, setDarkTheme] = useState("#020617");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleAdminClick = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount >= 5) {
      setIsAdminOpen(true);
      setAdminClickCount(0);
    }
  };

  const getButtonStyles = () => {
    if (theme !== "dark") {
      if (dayTheme === "#fdfdf9") {
        return {
          btnClass:
            "bg-gradient-to-br from-amber-200 via-[#fdfdf9] to-orange-200 border-amber-300 hover:border-amber-400 hover:from-amber-300 hover:via-[#fdfdf9] hover:to-orange-300 text-amber-950 shadow-[0_4px_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]",
          glowColor: "rgba(245,158,11,0.2)",
          hoverText: "group-hover/btn:text-amber-900",
          pingColor: "rgba(245,158,11,0.4)",
          starColor: "#f59e0b",
        };
      } else if (dayTheme === "#eff6ff") {
        return {
          btnClass:
            "bg-gradient-to-br from-sky-200 via-[#eff6ff] to-indigo-200 border-sky-300 hover:border-sky-400 hover:from-sky-300 hover:via-[#eff6ff] hover:to-indigo-300 text-sky-950 shadow-[0_4px_30px_rgba(56,189,248,0.25)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)]",
          glowColor: "rgba(56,189,248,0.2)",
          hoverText: "group-hover/btn:text-sky-900",
          pingColor: "rgba(56,189,248,0.4)",
          starColor: "#0284c7",
        };
      } else {
        return {
          btnClass:
            "bg-gradient-to-br from-emerald-200 via-[#f0fdf4] to-teal-200 border-teal-300 hover:border-teal-400 hover:from-emerald-300 hover:via-[#f0fdf4] hover:to-teal-300 text-teal-950 shadow-[0_4px_30px_rgba(20,184,166,0.25)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)]",
          glowColor: "rgba(20,184,166,0.25)",
          hoverText: "group-hover/btn:text-teal-900",
          pingColor: "rgba(20,184,166,0.4)",
          starColor: "#14b8a6",
        };
      }
    } else {
      if (darkTheme === "#020617") {
        return {
          btnClass:
            "bg-gradient-to-br from-[#0c1524] via-[#020617] to-slate-900 border-indigo-500/30 hover:border-indigo-400/50 text-white shadow-[0_4px_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)]",
          glowColor: "rgba(99,102,241,0.3)",
          hoverText: "group-hover/btn:text-indigo-200",
          pingColor: "rgba(255,255,255,0.6)",
          starColor: "#6366f1",
        };
      } else if (darkTheme === "#041a1c") {
        return {
          btnClass:
            "bg-gradient-to-br from-[#0a2f33] via-[#041a1c] to-teal-950 border-teal-500/30 hover:border-teal-400/50 text-white shadow-[0_4px_30px_rgba(20,184,166,0.25)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)]",
          glowColor: "rgba(20,184,166,0.3)",
          hoverText: "group-hover/btn:text-teal-200",
          pingColor: "rgba(255,255,255,0.6)",
          starColor: "#14b8a6",
        };
      } else {
        return {
          btnClass:
            "bg-gradient-to-br from-[#18181b] via-[#09090b] to-black border-purple-500/30 hover:border-purple-400/50 text-white shadow-[0_4px_30px_rgba(168,85,247,0.25)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]",
          glowColor: "rgba(168,85,247,0.3)",
          hoverText: "group-hover/btn:text-purple-200",
          pingColor: "rgba(255,255,255,0.6)",
          starColor: "#a855f7",
        };
      }
    }
  };

  const btnStyle = getButtonStyles();

  return (
    <div
      className="text-slate-900 dark:text-white font-sans flex flex-col min-h-screen overflow-x-hidden selection:bg-lime-500/30 dark:selection:bg-indigo-500/30 transition-colors duration-300"
      style={{ backgroundColor: theme === "dark" ? darkTheme : dayTheme }}
    >
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-5 lg:py-7 lg:px-12 border-b border-lime-900/10 dark:border-white/5 shrink-0 z-50 transition-colors duration-300 relative">
        {/* Left Elements (Brand Text) */}
        <div className="flex-1 flex items-center justify-start">
          <span
            className="font-sans font-bold text-[#D4AF37] tracking-tight block leading-none text-[28px] sm:text-[36px]"
          >
            {t("brand")}
          </span>
        </div>

        {/* Center Logo */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center gap-[20px] group cursor-pointer shrink-0"
          title={lang === "ar" ? "معلومات عن المبادرة" : "About Initiative"}
        >
          <img
            src={talkToMeLogo}
            alt="Talk to Me Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full transition-transform group-hover:scale-110 object-cover shadow-[0_0_20px_rgba(212,175,55,0.4)] border-2 border-[#D4AF37]/50"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Actions */}
        <nav
          className="flex items-center justify-end gap-2 md:gap-4 lg:gap-8 font-bold text-[#D4AF37] flex-1"
          style={{ fontSize: "36px" }}
        >
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
            title={lang === "en" ? "Toggle Theme" : "تغيير المظهر"}
          >
            {theme === "dark" ? (
              <Sun className="w-8 h-8" />
            ) : (
              <Moon className="w-8 h-8" />
            )}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <Globe className="w-8 h-8" />
            <span className="hidden sm:inline">
              {lang === "en" ? "العربية" : "English"}
            </span>
            <span className="sm:hidden">{lang === "en" ? "ع" : "EN"}</span>
          </button>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row px-6 lg:px-12 items-center justify-center lg:justify-between gap-12 lg:gap-8 py-12 lg:py-0 relative overflow-x-hidden min-h-[calc(100vh-5rem)]">
        {/* Left Column: Copy */}
        <div
          className={`w-full ${showTeleprompter ? "lg:w-[70%] lg:flex-none" : "lg:flex-1 lg:max-w-[55%]"} flex flex-col items-center text-center z-10 transition-all duration-500`}
        >
          {showTeleprompter ? (
            <Teleprompter onClose={() => setShowTeleprompter(false)} />
          ) : (
            <>
              <h1
                className={`mb-6 w-full flex flex-col gap-2 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_12px_12px_rgba(0,0,0,1)] text-center w-full min-w-0`}
              >
                <div
                  onClick={() => setShowTeleprompter(true)}
                  title="Click to open Teleprompter"
                  className="cursor-pointer hover:scale-[1.02] transition-transform w-full"
                >
                  <span
                    className={`inline-flex items-center justify-center w-full leading-none group flex-wrap gap-y-4`}
                    style={
                      lang === "ar"
                        ? { fontSize: "max(24px, min(5vw, 6rem))" }
                        : { fontSize: "max(24px, min(5.5vw, 6.5rem))" }
                    }
                  >
                  </span>
                  {lang === "en" && <br />}
                  <span
                    className={`${lang === "ar" ? "bg-gradient-to-b from-lime-600 via-emerald-500 to-teal-600 dark:from-[#e0ffff] dark:via-[#40e0d0] dark:to-[#008080] bg-clip-text text-transparent [-webkit-text-stroke:0.5px_rgba(0,0,0,0.1)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.4)] font-arabic text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.2]" : "text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tighter text-center italic font-serif text-lime-600 dark:text-indigo-400"}`}
                  >
                    {t("title2")}
                  </span>
                </div>
              </h1>

              <p
                className="text-base md:text-lg font-bold text-slate-600 dark:text-slate-300 leading-relaxed mb-[20px] max-w-2xl mx-auto text-center mt-6 font-times"
              >
                {t("description")}
              </p>

              {/* About the Initiative Button (عن المبادرة) */}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`relative px-8 py-3.5 rounded-full font-bold transition-all duration-500 hover:scale-105 border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] shrink-0 overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] ${btnStyle.btnClass}`}
              >
                {/* Radial background glow */}
                <div
                  className="absolute inset-0 animate-[pulse_3s_ease-in-out_infinite]"
                  style={{
                    background: `radial-gradient(circle at center, ${btnStyle.glowColor} 0%, transparent 80%)`,
                  }}
                />

                {/* Metallic Shimmer Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] animate-shimmer pointer-events-none" />

                <span
                  className="relative z-10 flex items-center justify-center tracking-wide text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-base sm:text-lg"
                >
                  {t("getStarted")}
                </span>
              </button>

              {/* Background Color Buttons */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold font-sans">
                  {theme === "dark"
                    ? lang === "ar"
                      ? "مظهر الخلفية المظلمة"
                      : "Dark Theme Background"
                    : lang === "ar"
                      ? "مظهر الخلفية النهارية"
                      : "Daylight Theme Background"}
                </span>
                <div className="flex gap-4 p-1.5 rounded-full bg-[#008080]/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                  {theme !== "dark" ? (
                    <>
                      <button
                        onClick={() => setDayTheme("#fdfdf9")}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 via-[#fdfdf9] to-orange-200 border-2 cursor-pointer transition-all duration-300 hover:scale-115 ${dayTheme === "#fdfdf9" ? "border-amber-500 scale-110 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "border-slate-300 dark:border-slate-600 opacity-80 hover:opacity-100"}`}
                        title="Warm Sunset"
                      />
                      <button
                        onClick={() => setDayTheme("#eff6ff")}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-sky-300 via-[#eff6ff] to-indigo-300 border-2 cursor-pointer transition-all duration-300 hover:scale-115 ${dayTheme === "#eff6ff" ? "border-sky-500 scale-110 ring-2 ring-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.4)]" : "border-slate-300 dark:border-slate-600 opacity-80 hover:opacity-100"}`}
                        title="Ocean Breeze"
                      />
                      <button
                        onClick={() => setDayTheme("#f0fdf4")}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-emerald-300 via-[#f0fdf4] to-teal-300 border-2 cursor-pointer transition-all duration-300 hover:scale-115 ${dayTheme === "#f0fdf4" ? "border-emerald-500 scale-110 ring-2 ring-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.4)]" : "border-slate-300 dark:border-slate-600 opacity-80 hover:opacity-100"}`}
                        title="Fresh Mint"
                      />
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setDarkTheme("#020617")}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#0c1524] via-[#020617] to-slate-900 border-2 cursor-pointer transition-all duration-300 hover:scale-115 ${darkTheme === "#020617" ? "border-indigo-400 scale-110 ring-2 ring-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "border-slate-600 opacity-80 hover:opacity-100"}`}
                        title={
                          lang === "ar" ? "أزرق كوني ملهم" : "Cosmic Slate"
                        }
                      />
                      <button
                        onClick={() => setDarkTheme("#041a1c")}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#0a2f33] via-[#041a1c] to-teal-950 border-2 cursor-pointer transition-all duration-300 hover:scale-115 ${darkTheme === "#041a1c" ? "border-teal-400 scale-110 ring-2 ring-teal-400/50 shadow-[0_0_15px_rgba(20,184,166,0.4)]" : "border-slate-600 opacity-80 hover:opacity-100"}`}
                        title={
                          lang === "ar"
                            ? "أعماق المبادرة الزمردية"
                            : "Deep Forest Emerald"
                        }
                      />
                      <button
                        onClick={() => setDarkTheme("#09090b")}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#18181b] via-[#09090b] to-black border-2 cursor-pointer transition-all duration-300 hover:scale-115 ${darkTheme === "#09090b" ? "border-purple-400 scale-110 ring-2 ring-purple-400/50 shadow-[0_0_15px_rgba(192,132,252,0.4)]" : "border-slate-600 opacity-80 hover:opacity-100"}`}
                        title={
                          lang === "ar"
                            ? "الكسوف الأسود العميق"
                            : "Obsidian Black"
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: The Widget */}
        <div
          id="recorder"
          className="relative flex justify-center shrink-0 w-full lg:w-auto z-20 pb-12 lg:pb-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] lg:-inset-20 h-full lg:h-auto bg-lime-400/20 dark:bg-indigo-600/20 blur-[80px] lg:blur-[100px] rounded-full pointer-events-none -z-10" />

          <div className="flex flex-col items-center gap-4 w-full max-w-[360px]">
            <div className="w-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] bg-white dark:bg-slate-950 transition-colors duration-300 border border-slate-200 dark:border-transparent">
              <VideoRecorderWidget />
            </div>
          </div>
        </div>
      </main>

      {/* How it works Section */}
      <section
        id="how-it-works"
        className="py-24 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2
            className={`text-4xl font-light mb-16 text-center text-slate-900 dark:text-white ${lang === "ar" ? "font-arabic" : ""}`}
          >
            <span
              className={`${lang === "ar" ? "bg-gradient-to-b from-lime-600 via-emerald-500 to-teal-600 dark:from-[#e0ffff] dark:via-[#40e0d0] dark:to-[#008080] bg-clip-text text-transparent" : "text-lime-600 dark:text-indigo-400 font-serif italic"}`}
            >
              {t("howItWorksTitle")}
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { num: "01", title: t("step1Title"), desc: t("step1Desc") },
              { num: "02", title: t("step2Title"), desc: t("step2Desc") },
              { num: "03", title: t("step3Title"), desc: t("step3Desc") },
              { num: "04", title: t("step4Title"), desc: t("step4Desc") },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 border border-slate-200 dark:border-white/5 rounded-3xl bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm dark:shadow-none"
              >
                <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-indigo-500/10 flex items-center justify-center text-lime-700 dark:text-indigo-400 font-mono font-bold mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Bottom Bar Info */}
      <footer className="h-16 px-6 py-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-center text-[10px] md:text-xs text-[#008B8B] uppercase tracking-widest font-medium shrink-0 transition-colors duration-300">
        <div className="flex gap-4 items-center">
          <span className="font-arabic text-sm">مبادرة : كلمنى عن نفسك فى دقيقتين</span>
          <img
            src={talkToMeLogo}
            alt="Talk to Me Logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-[0_0_10px_rgba(212,175,55,0.4)] border border-[#D4AF37]/50"
            referrerPolicy="no-referrer"
          />
          <span onClick={handleAdminClick} className="cursor-pointer">&copy; {new Date().getFullYear()} All Rights Reserved</span>
        </div>
      </footer>

      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}

      {/* Interactive Initiative Modal */}
      <InitiativeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        onStartAction={() => {
          const el = document.getElementById("recorder");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
