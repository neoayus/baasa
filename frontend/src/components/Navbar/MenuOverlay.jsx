import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import useScrollLock from "../../hooks/useScrollLock";
import SearchBar from "../SearchBar/SearchBar";
import SmartImage from "../ui/SmartImage";
import { LogoMark } from "../ui/Logo";
import { EASE_IN_OUT } from "../../animations/variants";
import { pad } from "../../utils/format";

const LINKS = [
  { label: "Profile", to: "/profile" },
  { label: "My Bookings", to: "/bookings" },
  { label: "Saved", to: "/saved" },
  { label: "List With Us", to: "/list-property" },
  { label: "Help & Support", to: "/support" },
  { label: "About", to: "/about" },
];

const MENU_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=75";

export default function MenuOverlay() {
  const { menuOpen, setMenuOpen, user, logout } = useApp();
  const closeRef = useRef(null);
  const close = () => setMenuOpen(false);
  useScrollLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 350);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [menuOpen, setMenuOpen]);

  const items = [
    ...LINKS,
    user
      ? { label: "Log out", action: true }
      : { label: "Login", to: "/login" },
  ];

  return createPortal(
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-lenis-prevent
          className="fixed inset-0 z-[80] overflow-y-auto bg-ink2"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT }}
        >
          <div className="container-x flex min-h-full flex-col pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
            <div className="flex h-16 items-center justify-between lg:h-20">
              <span className="inline-flex items-center gap-2.5">
                <LogoMark className="h-7 w-7" />
                <span className="meta">Menu</span>
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:bg-white/5"
              >
                Close <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 md:hidden">
              <SearchBar variant="menu" onSubmitted={close} />
            </div>

            <div className="mt-8 grid flex-1 gap-10 lg:mt-6 lg:grid-cols-[1.4fr_1fr]">
              <nav aria-label="Menu">
                <ul>
                  {items.map((item, i) => (
                    <li
                      key={item.label}
                      className="overflow-hidden border-b border-line"
                    >
                      <motion.div
                        initial={{ y: "105%" }}
                        animate={{
                          y: 0,
                          transition: {
                            delay: 0.3 + i * 0.045,
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                        exit={{ y: "105%", transition: { duration: 0.3 } }}
                      >
                        {item.action ? (
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              close();
                            }}
                            className="group flex w-full items-baseline gap-4 py-3 text-left md:gap-8 md:py-4"
                          >
                            <MenuInner index={i} label={item.label} />
                          </button>
                        ) : (
                          <Link
                            to={item.to}
                            onClick={close}
                            className="group flex items-baseline gap-4 py-3 md:gap-8 md:py-4"
                          >
                            <MenuInner index={i} label={item.label} />
                          </Link>
                        )}
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>

              <motion.aside
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.6, duration: 0.9 },
                }}
                exit={{ opacity: 0 }}
                className="hidden flex-col justify-between gap-8 lg:flex"
              >
                <Link
                  to="/explore"
                  onClick={close}
                  className="group relative block"
                >
                  <SmartImage
                    src={MENU_IMAGE}
                    alt="A modern house at dusk with warm lit windows"
                    className="aspect-[4/5] rounded-[2rem]"
                    imgClassName="transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                  <span className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-full bg-ink/70 px-5 py-3 text-sm backdrop-blur-md">
                    Explore all places <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <p className="meta">Verified homes · 10 cities · Real owners</p>
              </motion.aside>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function MenuInner({ index, label }) {
  return (
    <>
      <span className="meta w-7 shrink-0 transition-colors group-hover:text-accent">
        {pad(index + 1)}
      </span>
      <span className="font-display text-[clamp(1.9rem,5.2vw,4.2rem)] font-semibold leading-none tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-accent">
        {label}
      </span>
    </>
  );
}
