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
