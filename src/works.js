import gsap from "gsap";
import butterflyTrace from "./traces/butterfly.svg?raw";
import medusaTrace from "./traces/medusa.svg?raw";
import lionTrace from "./traces/lion.svg?raw";
import handTrace from "./traces/hand.svg?raw";
import thrillTrace from "./traces/thrill.svg?raw";

const WORKS = [
  {
    id: "butterfly",
    src: "tattoos/tatoo_4.jpg",
    width: 1343,
    height: 1735,
    alt: "Kelebek kanatlarında bir yüz dövmesi",
    kicker: "01",
    title: "Kelebek",
    trace: butterflyTrace,
    story:
      "Kanatların içinde bir yüz duruyor: kaş, göz, ağız, hepsi kelebeğin kendisi. Alttaki damlalar kurumamış mürekkep gibi. Bu desen birini tutmak için değil; gitmesine izin verirken yüzü kanada çevirmek için duruyor.",
  },
  {
    id: "medusa",
    src: "tattoos/tattoo_1.jpg",
    width: 1440,
    height: 1440,
    alt: "Ön kolda Medusa dövmesi",
    kicker: "02",
    title: "Medusa",
    trace: medusaTrace,
    story:
      "Yılanlar saçın yerini almış, bakış ağır. Buradaki Medusa korkutmak için çevrilmiyor. Bakılmaktan yorulmuş birinin, kolunu kaldırınca karşıya çevirdiği yüz. Kim bakacak, artık ona kalmış.",
  },
  {
    id: "lion",
    src: "tattoos/tattoo_6.jpg",
    width: 1004,
    height: 1004,
    alt: "Ön kolda aslan ve palmiye yaprakları dövmesi",
    kicker: "03",
    title: "Aslan",
    trace: lionTrace,
    story:
      "Dişi aslan, palmiye yapraklarının arasında. Çizgiler kolu takip ediyor, yapraklar rüzgârı. Kükreme yok. Sıcak bir yerde, bağırmadan ayakta durmanın resmi.",
  },
  {
    id: "hand",
    src: "tattoos/tatoo_5.jpg",
    width: 1440,
    height: 1440,
    alt: "El üzerinde kanatlı figür dövmesi",
    kicker: "04",
    title: "El",
    trace: handTrace,
    story:
      "Figür elin sırtında, kanatlar parmaklara iniyor. El kapanınca kanat da kapanır. Cebin işi değil; tutan, çalışan, sallayan elde taşınan bir şey. Çizgiler parmak ucuna kadar sürüyor, çünkü orada kalsın diye.",
  },
  {
    id: "thrill",
    src: "tattoos/tattoo_3.jpg",
    width: 1440,
    height: 1440,
    alt: "Ön kolda thrill yazısı ve göz dövmesi",
    kicker: "05",
    title: "Thrill",
    trace: thrillTrace,
    story:
      "Üstte tek kelime. Altta, sert bir dikdörtgenin içinde kırpmayan bir göz. Olan şey değil, olmadan hemen önceki saniye. Kelime, sahnenin adı gibi duruyor.",
  },
];

export function worksMarkup(base) {
  const sections = WORKS.map((work, index) => {
    const trace = work.trace.replace("<svg ", '<svg class="work-trace" aria-hidden="true" ');
    const flip = index % 2 === 1 ? " is-flip" : "";
    const heading = index === 0 ? `<p class="studio-works-title">Çalışmalar</p>` : "";
    return `
      <article class="work-section${flip}" id="work-${work.id}">
        <div class="work-copy">
          ${heading}
          <p class="work-kicker">${work.kicker}</p>
          <h2>${work.title}</h2>
          <p class="work-story">${work.story}</p>
        </div>
        <div class="work-frame">
          <img
            class="work-photo"
            src="${base}${work.src}"
            alt="${work.alt}"
            width="${work.width}"
            height="${work.height}"
          >
          ${trace}
        </div>
      </article>
    `;
  }).join("");

  return `
    <div class="works">
      ${sections}
    </div>
  `;
}

export function mountWorkReveals(root) {
  const page = document.querySelector("#page");
  const sections = [...root.querySelectorAll(".work-section")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tweens = [];

  sections.forEach((section) => prepare(section, reduced));
  if (reduced) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target.closest(".work-section");
        if (!section || section.dataset.played) return;
        section.dataset.played = "true";
        io.unobserve(entry.target);
        tweens.push(play(section));
      });
    },
    { root: page, threshold: 0.45 },
  );

  sections.forEach((section) => io.observe(section.querySelector(".work-frame")));

  return () => {
    io.disconnect();
    tweens.forEach((tween) => tween.kill());
  };
}

function prepare(section, reduced) {
  const photo = section.querySelector(".work-photo");
  const paths = [...section.querySelectorAll(".work-trace path")];
  if (reduced) {
    section.classList.add("is-static");
    gsap.set(photo, { opacity: 1 });
    gsap.set(section.querySelector(".work-trace"), { opacity: 0 });
    return;
  }
  gsap.set(photo, { opacity: 0 });
  paths.forEach((path) => {
    const length = path.getTotalLength();
    if (!length) return;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });
}

function play(section) {
  const photo = section.querySelector(".work-photo");
  const trace = section.querySelector(".work-trace");
  const paths = [...section.querySelectorAll(".work-trace path")].filter((path) => path.getTotalLength());
  const draw = 3.6;
  const timeline = gsap.timeline();

  paths.forEach((path, index) => {
    const start = paths.length < 2 ? 0 : (index / (paths.length - 1)) * draw * 0.55;
    timeline.to(
      path,
      { strokeDashoffset: 0, duration: draw - start, ease: "power2.inOut" },
      start,
    );
  });

  timeline.to(photo, { opacity: 1, duration: draw * 0.8, ease: "power2.out" }, draw * 0.35);
  timeline.to(trace, { opacity: 0, duration: 0.9, ease: "power2.out" }, draw);
  return timeline;
}
