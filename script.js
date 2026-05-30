const themeToggleEl = document.getElementById("theme-toggle");
const yearEl = document.getElementById("year");

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggleEl) {
    themeToggleEl.innerHTML = theme === "dark" ? '<span aria-hidden="true">☀️</span> Theme' : '<span aria-hidden="true">🌙</span> Theme';
  }
};

const initTheme = () => {
  const stored = localStorage.getItem("portfolio-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(stored || (preferredDark ? "dark" : "light"));
};

const bindThemeToggle = () => {
  if (!themeToggleEl) return;
  themeToggleEl.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
  });
};

const init = () => {
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  initTheme();
  bindThemeToggle();
};

init();
