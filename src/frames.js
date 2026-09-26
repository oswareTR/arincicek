import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import layouts from "./stems/layouts.json";
import spriteRaw from "./stems/sprite.svg?raw";

gsap.registerPlugin(ScrollTrigger);

const NS = "http://www.w3.org/2000/svg";
const SECTIONS = ".studio, .work-section, .booking, .page-panel, .site-footer";
const symbols = new Map();

export function mountSectionFrames(root) {
  ensureSymbols();
  const page = root.id === "page" ? root : document.querySelector("#page");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stops = [...root.querySelectorAll(SECTIONS)].map((section, index) =>
    mountFrame(section, page, layouts[index % layouts.length], reduced),
  );

  return () => {
    stops.forEach((stop) => stop());
    ScrollTrigger.getAll().forEach((trigger) => {
      const triggerNode = trigger.trigger;
      if (trigger.scroller === page || (triggerNode instanceof Node && page.contains(triggerNode))) {
        trigger.kill();
      }
    });
  };
}

function liveList(targets) {
  const list = (Array.isArray(targets) ? targets : [targets]).filter((node) => node && node.nodeType === 1);
  return list.length ? list : null;
}

function setIf(targets, vars) {
  const list = liveList(targets);
  if (!list) return;
  gsap.set(list, vars);
}

function mountFrame(section, page, layout, reduced) {
  const frame = document.createElement("div");
  frame.className = "section-frame";
  const lineSvg = el("svg", { class: "section-frame-line-svg", "aria-hidden": "true" });
  const line = el("path", { class: "section-frame-line" });
  const stems = document.createElement("div");
  stems.className = "section-frame-stems";
  lineSvg.append(line);
  frame.append(lineSvg, stems);
  section.append(frame);

  let lineTween;
  let stemTween;
  let stemTrigger;
  let grown = false;
  let builtMode = "";
  let raf = 0;

  const drawLine = () => {
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    if (width < 8 || height < 8) return false;
    lineSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const radius = Math.min(18, width * 0.035, height * 0.035);
    line.setAttribute("d", roundedRect(1.4, 1.4, width - 2.8, height - 2.8, radius));
    const length = line.getTotalLength();
    setIf(line, { strokeDasharray: length, strokeDashoffset: reduced ? 0 : length });
    lineTween?.scrollTrigger?.kill();
    lineTween?.kill();
    if (reduced) return true;
    lineTween = gsap.fromTo(
      line,
      { strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: page,
          start: "top 96%",
          end: "top 4%",
          scrub: 2.7,
        },
      },
    );
    return true;
  };

  const buildStems = (mode) => {
    stems.replaceChildren();
    const placed = layout[mode].map((placement) => stampStem(placement));
    placed.forEach((node) => stems.append(node.svg));
    const ready = grown || reduced;
    placed.forEach((node) => {
      node.vines.forEach((vine) => {
        if (!vine.path) return;
        setIf(vine.path, {
          strokeDasharray: vine.length,
          strokeDashoffset: ready ? 0 : vine.length,
        });
      });
      setIf([...node.leaves, ...node.blooms], { opacity: ready ? 1 : 0 });
    });
    if (ready) return;

    const grow = () => {
      if (grown) return;
      grown = true;
      stemTween?.kill();
      stemTween = gsap.timeline();
      placed.forEach((node, stemIndex) => {
        const at = stemIndex * 0.16;
        node.vines.forEach((vine) => {
          if (!vine.path) return;
          stemTween.fromTo(
            vine.path,
            { strokeDashoffset: vine.length },
            { strokeDashoffset: 0, duration: 7.5, ease: "power2.inOut" },
            at,
          );
        });
        const marks = liveList([...node.leaves, ...node.blooms]);
        if (!marks) return;
        stemTween.fromTo(marks, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: "power2.out" }, at + 5.8);
      });
    };

    stemTrigger?.kill();
    stemTrigger = ScrollTrigger.create({
      trigger: section,
      scroller: page,
      start: "top 78%",
      onEnter: grow,
      onEnterBack: grow,
    });
  };

  const update = () => {
    if (!drawLine()) return;
    const mode = frame.clientWidth < 700 ? "mobile" : "desktop";
    if (builtMode === mode) return;
    if (stemTween?.isActive()) grown = false;
    stemTween?.kill();
    builtMode = mode;
    buildStems(mode);
  };

  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  });
  observer.observe(frame);
  update();

  return () => {
    cancelAnimationFrame(raf);
    observer.disconnect();
    lineTween?.scrollTrigger?.kill();
    lineTween?.kill();
    stemTrigger?.kill();
    stemTween?.kill();
    frame.remove();
  };
}

function stampStem(placement) {
  const symbol = symbols.get(placement.id);
  const [, , width, height] = symbol.getAttribute("viewBox").split(" ").map(Number);
  const svg = el("svg", {
    class: "section-frame-stem",
    viewBox: symbol.getAttribute("viewBox"),
    width: width * placement.scale,
    height: height * placement.scale,
    "aria-hidden": "true",
  });
  [...symbol.children].forEach((child) => svg.append(child.cloneNode(true)));
  svg.style.left = `${placement.at}%`;
  const flip = placement.flip ? -1 : 1;
  if (placement.edge === "bottom") {
    svg.style.bottom = "0";
    svg.style.transform = `translate(-50%, 0) rotate(180deg) scaleX(${flip})`;
  } else {
    svg.style.top = "0";
    svg.style.transform = `translate(-50%, 0) scaleX(${flip})`;
  }
  return {
    svg,
    vines: [...svg.querySelectorAll(".section-frame-vine")].map((path) => ({
      path,
      length: Number(path.getAttribute("data-length")),
    })),
    leaves: [...svg.querySelectorAll(".section-frame-leaf")],
    blooms: [...svg.querySelectorAll(".section-frame-bloom")],
  };
}

function ensureSymbols() {
  if (symbols.size) return;
  const parsed = new DOMParser().parseFromString(spriteRaw, "image/svg+xml");
  parsed.querySelectorAll("symbol").forEach((symbol) => symbols.set(symbol.id, symbol));
}

function roundedRect(x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  return [
    `M ${x + r} ${y}`,
    `H ${x + width - r}`,
    `A ${r} ${r} 0 0 1 ${x + width} ${y + r}`,
    `V ${y + height - r}`,
    `A ${r} ${r} 0 0 1 ${x + width - r} ${y + height}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + height - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
  ].join(" ");
}

function el(name, attrs) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}
