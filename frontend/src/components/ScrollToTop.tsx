import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "auto" }: { behavior?: ScrollBehavior }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // try to scroll to element for hash links
      const id = decodeURIComponent(hash.replace("#", ""));
      const el = document.getElementById(id) || document.querySelector(hash);
      if (el) {
        (el as HTMLElement).scrollIntoView({ behavior: behavior === "smooth" ? "smooth" : "auto" });
        return;
      }
    }
    // default: go to top on route change
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, hash, behavior]);

  return null;
}