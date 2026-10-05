/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
const nav = document.querySelector(".nav");

function closeMenu() {
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}

// Toggle on hamburger tap
toggle.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent the document listener from firing immediately
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

// Close when a link is tapped
links
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));

// Close when tapping anywhere outside the nav
document.addEventListener("click", (e) => {
  if (!links.classList.contains("open")) return;
  if (!nav.contains(e.target)) closeMenu();
});

// Close on Escape key (keyboard accessibility)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ==========================================================================
   SMOOTH ANCHOR SCROLL — nav-height aware
   Works whether the mobile menu is open, closed, or mid-animation, and
   handles deep links on first load plus back/forward history navigation.
   ========================================================================== */
(function () {
  const navEl = document.querySelector(".nav");
  if (!navEl) return;

  // Menu transition is 0.28s; wait a touch longer so the nav has settled.
  const MENU_SETTLE_MS = 320;
  const EXTRA_GAP = -60; // breathing room below the nav

  /**
   * Scroll so `target` sits just below the (current) nav.
   * @param {Element} target
   * @param {boolean} smooth
   */
  function scrollToTarget(target, smooth = true) {
    const navHeight = navEl.getBoundingClientRect().height;
    const targetY =
      target.getBoundingClientRect().top +
      window.scrollY -
      navHeight -
      EXTRA_GAP;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: smooth ? "smooth" : "auto",
    });
  }

  /**
   * Resolve a hash like "#labs" to its element, or null if none.
   * Ignores bare "#" and non-hash values.
   */
  function resolveHash(hash) {
    if (!hash || hash === "#" || hash.length < 2) return null;
    try {
      return document.querySelector(hash);
    } catch {
      return null; // invalid selector (e.g. "#123")
    }
  }

  /* ---------------------------------------------------------------------
     In-page clicks on any anchor link
     --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const target = resolveHash(href);
      if (!target) return; // let the browser handle it

      e.preventDefault();

      // The menu may be mid-collapse. Wait for it to settle, then measure.
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToTarget(target, true);

          // Keep the URL in sync without triggering the browser's own jump.
          history.pushState(null, "", href);
        }, MENU_SETTLE_MS);
      });
    });
  });

  /* ---------------------------------------------------------------------
     Deep link on first load
     e.g. someone opens  yoursite.com/#contact  directly, or refreshes on
     a hash. The browser has already tried to jump to the target using its
     default offset; we override that with our nav-aware scroll.
     --------------------------------------------------------------------- */
  function handleInitialHash() {
    const target = resolveHash(window.location.hash);
    if (!target) return;

    // Wait for fonts/layout so getBoundingClientRect() is accurate.
    // rAF x2 is a common pattern that fires after the first paint.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Disable the browser's smooth-scroll on first load so we don't
        // visibly animate from the top after the default jump.
        scrollToTarget(target, false);

        // Some browsers keep the default jump applied; nudge once more
        // after the next frame to be safe.
        requestAnimationFrame(() => scrollToTarget(target, false));
      });
    });
  }

  // Run after the page has fully loaded (images, fonts, etc. affect layout).
  if (document.readyState === "complete") {
    handleInitialHash();
  } else {
    window.addEventListener("load", handleInitialHash, { once: true });
  }

  /* ---------------------------------------------------------------------
     Back / forward navigation between hashes
     The browser does its own jump on popstate; override it with ours.
     --------------------------------------------------------------------- */
  window.addEventListener("popstate", () => {
    const target = resolveHash(window.location.hash);
    if (!target) return;

    requestAnimationFrame(() => {
      scrollToTarget(target, true);
    });
  });
})();

/* ==========================================================================
   THEME TOGGLE
   Dark is the default. The inline bootstrap script in <head> has already
   applied data-theme="light" if (and only if) the user previously chose it.
   This block just wires up the button and handles persistence.
   ========================================================================== */
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  const STORAGE_KEY = "theme";

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme, persist) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme"); // dark = default = no attribute
    }

    const isLight = theme === "light";
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {}
    }
  }

  // Sync the button's ARIA state with whatever the bootstrap already decided
  applyTheme(currentTheme(), false);

  toggle.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    applyTheme(next, true);
  });
})();


function scrollToTarget(target, smooth = true) {
  // If we were given a <section>, scroll to its first heading instead.
  const heading = target.matches("section")
    ? target.querySelector("h1, h2, h3")
    : target;
  const scrollTarget = heading || target;

  const navHeight = navEl.getBoundingClientRect().height;
  const targetY =
    scrollTarget.getBoundingClientRect().top +
    window.scrollY -
    navHeight -
    EXTRA_GAP;

  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: smooth ? "smooth" : "auto",
  });
}


document
  .querySelectorAll(".nav-links a, .nav-cta")
  .forEach((a) => a.addEventListener("click", closeMenu));