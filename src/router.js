import { homePage } from "./pages/home.js";
import { aboutPage } from "./pages/about.js";
import { contactPage } from "./pages/contact.js";
import { notFoundPage } from "./pages/not-found.js";

const routes = {
  "/": homePage,
  "/about": aboutPage,
  "/contact": contactPage,
};

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/";
}

function setActiveNav(path) {
  document.querySelectorAll("[data-link]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPath = href.replace(/^#/, "") || "/";
    const isBrand = link.classList.contains("brand");
    link.setAttribute(
      "aria-current",
      !isBrand && linkPath === path ? "page" : "false",
    );
  });
}

export function startRouter(root) {
  const render = () => {
    const path = currentPath();
    const page = routes[path] ?? notFoundPage;
    root.replaceChildren(page());
    setActiveNav(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  window.addEventListener("hashchange", render);
  render();
}
