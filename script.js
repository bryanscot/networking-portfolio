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
   THEME TOGGLE
   Dark is the default. The inline bootstrap script in <head> has already
   applied data-theme="light" if (and only if) the user previously chose it.
   This block just wires up the button and handles persistence.
   ========================================================================== */
(function () {
  const root   = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const STORAGE_KEY = 'theme';

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme, persist) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');   // dark = default = no attribute
    }

    const isLight = theme === 'light';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');

    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
  }

  // Sync the button's ARIA state with whatever the bootstrap already decided
  applyTheme(currentTheme(), false);

  toggle.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
  });
})();