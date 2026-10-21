import { useEffect } from "react";

const DEFAULT = "BAASA— Find somewhere worth calling home";

export default function useDocTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — BAASA` : DEFAULT;
    if (description) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", description);
    }
  }, [title, description]);
}
