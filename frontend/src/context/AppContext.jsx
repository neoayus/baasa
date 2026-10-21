import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import * as auth from "../services/authService";
import * as propertyService from "../services/propertyService";

const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => auth.getSession());
  const [favorites, setFavorites] = useState(() =>
    propertyService.getSavedIds(),
  );
  const [toasts, setToasts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inquiryFor, setInquiryFor] = useState(null);
  const [expertOpen, setExpertOpen] = useState(false);

  const dismissToast = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  const toast = useCallback(
    (message, type = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((t) => [...t.slice(-2), { id, message, type }]);
      setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast],
  );

  const login = useCallback(
    async (credentials) => {
      const session = await auth.login(credentials);
      setUser(session);
      toast(`Logged in as ${session.name.split(" ")[0]}`);
      return session;
    },
    [toast],
  );

  const signup = useCallback(
    async (data) => {
      const session = await auth.signup(data);
      setUser(session);
      toast("Account created — welcome to BAASA");
      return session;
    },
    [toast],
  );

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
    toast("Logged out", "info");
  }, [toast]);

  const updateUser = useCallback(
    async (patch) => {
      const session = await auth.updateProfile(user.id, patch);
      setUser(session);
      toast("Profile updated");
      return session;
    },
    [user, toast],
  );

  const toggleFavorite = useCallback(
    async (id) => {
      const willSave = !favorites.includes(id);
      setFavorites((f) => (willSave ? [...f, id] : f.filter((x) => x !== id)));
      try {
        const res = await propertyService.saveProperty(id);
        setFavorites(res.ids);
        toast(
          res.saved ? "Property saved" : "Removed from saved",
          res.saved ? "success" : "info",
        );
      } catch {
        setFavorites(propertyService.getSavedIds());
        toast("Could not update saved properties", "error");
      }
    },
    [favorites, toast],
  );

  const openInquiry = useCallback((property) => setInquiryFor(property), []);
  const closeInquiry = useCallback(() => setInquiryFor(null), []);
  const openExpert = useCallback(() => setExpertOpen(true), []);
  const closeExpert = useCallback(() => setExpertOpen(false), []);

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      updateUser,
      favorites,
      toggleFavorite,
      toasts,
      toast,
      dismissToast,
      menuOpen,
      setMenuOpen,
      inquiryFor,
      openInquiry,
      closeInquiry,
      expertOpen,
      openExpert,
      closeExpert,
    }),
    [
      user,
      login,
      signup,
      logout,
      updateUser,
      favorites,
      toggleFavorite,
      toasts,
      toast,
      dismissToast,
      menuOpen,
      inquiryFor,
      openInquiry,
      closeInquiry,
      expertOpen,
      openExpert,
      closeExpert,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
