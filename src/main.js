import "./style.css";
import { mountSectionFrames } from "./frames.js";
import { mountVineFrame } from "./vines.js";
import { featuredPlayer, featuredTrack, tracksMarkup } from "./tracks.js";
import { mountEnterReveals, mountWorkReveals, worksMarkup } from "./works.js";

const INSTAGRAM_URL = "https://www.instagram.com/arintattoo7/";
const YOUTUBE_URL = "https://www.youtube.com/@ArinOfficiall/videos";
const SPOTIFY_URL = "https://open.spotify.com/artist/7L9cxWoJS4joiFLUnXMD7g";

const ROUTES = {
  tattoo: {
    title: "Tattoo",
    heading: "Tattoo",
  },
  muzik: {
    title: "Müzik",
    heading: "Müzik",
  },
};

const tattooIcon = `
  <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.4 12h2.2"/>
    <path d="M4.6 8.6h8.2c.7 0 1.2.5 1.2 1.2v4.4c0 .7-.5 1.2-1.2 1.2H4.6c-.7 0-1.2-.5-1.2-1.2V9.8c0-.7.5-1.2 1.2-1.2z"/>
    <path d="M6.6 8.6V6.4h4.4v2.2"/>
    <path d="M8 6.4v2.2M9.8 6.4v2.2"/>
    <path d="M14 12h6.4"/>
    <path d="M18.2 10.5 21.2 12l-3 1.5"/>
  </svg>
`;

const musicIcon = `
  <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 17.8V6.2l8.2-1.8v11.2"/>
    <ellipse cx="6.6" cy="17.8" rx="2.4" ry="1.9"/>
    <ellipse cx="14.8" cy="15.6" rx="2.4" ry="1.9"/>
  </svg>
`;

const instagramIcon = `
  <svg class="nav-brand" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5"/>
    <circle cx="12" cy="12" r="3.6"/>
    <circle cx="17.1" cy="6.9" r="0.9" fill="#ffffff" stroke="none"/>
  </svg>
`;

const youtubeIcon = `
  <svg class="nav-brand" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2.2" y="6.2" width="19.6" height="11.6" rx="3.2"/>
    <path d="M10.4 9.6v4.8l4.2-2.4z" fill="#ffffff" stroke="none"/>
  </svg>
`;

const app = document.querySelector("#app");
app.innerHTML = `
  <div class="nav-cluster">
    <a class="nav-social nav-social-ig" href="${INSTAGRAM_URL}" target="_blank" rel="noreferrer" aria-label="Instagram">${instagramIcon}</a>
    <nav class="navbar" aria-label="Ana menü">
      <a class="nav-link" data-route="tattoo" href="#/tattoo">${tattooIcon}<span>Tattoo</span></a>
      <a class="nav-link" data-route="muzik" href="#/muzik">${musicIcon}<span>Müzik</span></a>
    </nav>
    <a class="nav-social nav-social-yt" href="${YOUTUBE_URL}" target="_blank" rel="noreferrer" aria-label="YouTube">${youtubeIcon}</a>
  </div>
  <main class="page" id="page"></main>
`;

mountVineFrame(app);

const navCluster = document.querySelector(".nav-cluster");
const page = document.querySelector("#page");
const links = [...document.querySelectorAll(".nav-link")];
let releasePage = () => {};
app.append(navCluster);

function currentRoute() {
  const slug = location.hash.replace(/^#\/?/, "");
  return slug in ROUTES ? slug : "tattoo";
}

function render() {
  const route = currentRoute();
  const view = ROUTES[route];

  if (!location.hash || !(location.hash.replace(/^#\/?/, "") in ROUTES)) {
    history.replaceState(null, "", "#/tattoo");
  }

  releasePage();
  releasePage = () => {};

  document.title = `Arıncık — ${view.title}`;
  const viewMarkup = route === "tattoo" ? tattooPage() : musicPage();
  page.innerHTML = viewMarkup + siteFooter();
  page.scrollTop = 0;

  page.classList.add("is-snap");
  const releaseFrames = mountSectionFrames(page);
  const releaseWorks = route === "tattoo" ? mountWorkReveals(page) : () => {};
  const releaseEnter = mountEnterReveals(page);
  releasePage = () => {
    releaseEnter();
    releaseWorks();
    releaseFrames();
  };

  links.forEach((link) => {
    const active = link.dataset.route === route;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function siteFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <p class="footer-kicker">Nevşehir · dövme ve müzik</p>
          <p class="footer-name">Arıncık</p>
          <p class="footer-lead">Nevşehir’de kişiye özel dövme ve Arin’in müziği. Randevu için Instagram’dan yazın.</p>
        </div>
        <div class="footer-panel">
          <div class="footer-col">
            <p class="footer-label">Stüdyo</p>
            <p>Nevşehir, Türkiye</p>
            <p>Salı–Cumartesi</p>
            <p>12:00–20:00</p>
          </div>
          <div class="footer-col">
            <p class="footer-label">İletişim</p>
            <a class="footer-cta" href="${INSTAGRAM_URL}" target="_blank" rel="noreferrer">@arintattoo7</a>
            <p>Randevu ve çalışmalar için yazın.</p>
          </div>
          <nav class="footer-social" aria-label="Sosyal medya">
            <p class="footer-label">Sosyal</p>
            <ul>
              <li>
                <a href="${INSTAGRAM_URL}" target="_blank" rel="noreferrer">
                  <span class="footer-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.1" cy="6.9" r="0.8" fill="currentColor" stroke="none"/></svg></span>
                  Instagram
                </a>
              </li>
              <li>
                <a href="${SPOTIFY_URL}" target="_blank" rel="noreferrer">
                  <span class="footer-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.4"/><path d="M7.6 10.1c2.7-1.1 6.2-.9 8.7.6"/><path d="M8.1 12.9c2.1-.8 4.6-.6 6.5.5"/><path d="M8.7 15.5c1.5-.5 3.2-.4 4.6.4"/></svg></span>
                  Spotify
                </a>
              </li>
              <li>
                <a href="${YOUTUBE_URL}" target="_blank" rel="noreferrer">
                  <span class="footer-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="6.5" width="18" height="11" rx="3"/><path d="M10.6 9.8v4.4l3.8-2.2z" fill="currentColor" stroke="none"/></svg></span>
                  YouTube
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p class="footer-note">© 2026 Arıncık</p>
      </div>
    </footer>
  `;
}

function musicPage() {
  return `
    <section class="studio is-music" data-page="muzik">
      <header class="studio-copy">
        <p class="studio-kicker">YouTube · @ArinOfficiall</p>
        <h1>Müzik</h1>
        <p class="studio-lead">Sözü de müziği de Arin’in.</p>
        <p class="studio-note">${featuredTrack.note}</p>
        <a
          class="studio-link"
          href="${YOUTUBE_URL}"
          target="_blank"
          rel="noreferrer"
        >
          YouTube’da dinle
        </a>
        <p class="studio-award-title">${featuredTrack.title}<br>${featuredTrack.stat.join("<br>")}</p>
      </header>
      <figure class="studio-award">
        ${featuredPlayer()}
      </figure>
    </section>
    ${tracksMarkup()}
    <section class="booking">
      <h2>Şimdi dinlemek için kanala gel</h2>
      <iframe
        class="booking-embed is-wide"
        src="https://www.youtube-nocookie.com/embed/videoseries?list=PL3XxaoLBeQJAeiA1uhy_ahWtK0y0rZo-M"
        title="Arin YouTube çalma listesi"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </section>
  `;
}

function tattooPage() {
  const base = import.meta.env.BASE_URL;

  return `
    <section class="studio" data-page="tattoo">
      <header class="studio-copy">
        <p class="studio-kicker">Nevşehir · @arintattoo7</p>
        <h1>Tattoo</h1>
        <p class="studio-lead">Nevşehir’de kişiye özel dövme.</p>
        <p class="studio-note">
          Reşit sayılmayanlara istisnasız dövme yapılmamaktadır. Randevu için Instagram’dan yazın.
        </p>
        <a
          class="studio-link"
          href="${INSTAGRAM_URL}"
          target="_blank"
          rel="noreferrer"
        >
          Instagram’dan randevu al
        </a>
        <p class="studio-award-title">2026 Alaawards<br>En İyi Dövme<br>Sanatçısı</p>
      </header>
      <figure class="studio-award">
        <img
          src="${base}tattoos/tattoo_2.jpg"
          alt="Arin Çiçek, Alaawards En İyi Dövme Sanatçısı ödülünü tutarken"
          width="640"
          height="1136"
        >
      </figure>
    </section>
    ${worksMarkup(base)}
    <section class="booking">
      <h2>Şimdi randevu almak için DM at</h2>
      <iframe
        class="booking-embed"
        src="https://www.instagram.com/arintattoo7/embed/"
        title="Arıncık Instagram profili"
        loading="lazy"
      ></iframe>
    </section>
  `;
}

window.addEventListener("hashchange", render);
render();
