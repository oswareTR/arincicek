import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "stems");
const leafPath = "M0 0 C-3.2-4.6-4.2-11.4 0-17.2 C4.2-11.4 3.2-4.6 0 0 Z";

const stems = [
  vine("stem-01", [[[18, 1, 26, 8, 14, 16, 22, 30]]], [{ at: 1, scale: 0.72, tilt: 8 }]),
  vine("stem-02", [[[18, 1, 8, 7, 24, 16, 12, 31]]], [{ at: 1, scale: 0.7, tilt: -10 }]),
  vine("stem-03", [[[18, 1, 24, 6, 28, 14, 20, 20]]], [{ at: 1, scale: 0.48, tilt: 4 }]),
  vine("stem-04", [[[18, 1, 10, 5, 8, 14, 16, 19]]], [{ at: 1, scale: 0.46, tilt: -6 }]),
  vine("stem-05", [[[18, 1, 22, 10, 16, 20, 24, 36]], [[24, 18, 32, 16, 34, 24, 30, 28]]], [{ at: 1, scale: 0.66, tilt: 6 }]),
  vine("stem-06", [[[18, 1, 12, 9, 20, 18, 10, 34]], [[14, 16, 4, 14, 6, 24, 8, 30]]], [{ at: 1, scale: 0.64, tilt: -8 }]),
  vine("stem-07", [[[18, 1, 30, 6, 34, 18, 26, 32]]], [{ at: 1, scale: 0.8, tilt: 12 }]),
  vine("stem-08", [[[18, 1, 6, 6, 2, 18, 12, 33]]], [{ at: 1, scale: 0.78, tilt: -14 }]),
  vine("stem-09", [[[18, 1, 23, 7, 13, 14, 21, 24], [21, 24, 16, 28, 15, 32, 19, 38]]], []),
  vine("stem-10", [[[18, 1, 27, 9, 10, 18, 20, 28]]], [{ at: 1, scale: 0.58, tilt: 0 }]),
  vine("stem-11", [[[18, 1, 14, 8, 26, 14, 16, 26], [16, 26, 12, 32, 22, 36, 20, 40]]], [{ at: 0.62, scale: 0.42, tilt: -12 }, { at: 1, scale: 0.7, tilt: 6 }]),
  vine("stem-12", [[[18, 1, 21, 4, 16, 8, 19, 12]]], [{ at: 1, scale: 0.36, tilt: 2 }]),
  vine("stem-13", [[[18, 1, 28, 12, 30, 24, 24, 40]]], [{ at: 1, scale: 0.84, tilt: 10 }]),
  vine("stem-14", [[[18, 1, 8, 12, 6, 24, 14, 40]]], [{ at: 1, scale: 0.82, tilt: -9 }]),
  vine("stem-15", [[[18, 1, 20, 10, 18, 18, 22, 30]], [[22, 16, 30, 18, 28, 26, 32, 24]]], [{ at: 0.55, scale: 0.4, tilt: 16 }, { at: 1, scale: 0.62, tilt: -4 }]),
  vine("stem-16", [[[18, 1, 25, 6, 11, 12, 24, 20], [24, 20, 12, 26, 16, 32, 20, 38]]], [{ at: 1, scale: 0.6, tilt: 5 }]),
  vine("stem-17", [[[18, 1, 15, 8, 28, 12, 8, 22], [8, 22, 14, 28, 18, 34, 16, 40]]], []),
  vine("stem-18", [[[18, 1, 22, 5, 14, 11, 24, 18]]], [{ at: 1, scale: 0.5, tilt: -3 }]),
  vine("stem-19", [[[18, 1, 10, 10, 28, 16, 16, 28], [16, 28, 22, 33, 26, 37, 20, 41]]], [{ at: 1, scale: 0.74, tilt: 11 }]),
  vine("stem-20", [[[18, 1, 26, 11, 8, 17, 20, 27], [20, 27, 14, 32, 11, 36, 18, 41]]], [{ at: 0.7, scale: 0.38, tilt: -18 }, { at: 1, scale: 0.58, tilt: 7 }]),
  vine("stem-21", [[[18, 1, 30, 4, 8, 12, 24, 22], [24, 22, 34, 28, 16, 34, 22, 40]]], [], [{ at: 1, kind: "blossom", scale: 0.85, tilt: 12 }]),
  vine("stem-22", [[[18, 1, 6, 8, 28, 14, 12, 26], [12, 26, 4, 32, 16, 38, 14, 41]]], [{ at: 0.45, scale: 0.4, tilt: 8 }], [{ at: 1, kind: "daisy", scale: 0.72, tilt: -6 }]),
  vine("stem-23", [[[18, 1, 22, 6, 14, 12, 20, 18]]], [], [{ at: 1, kind: "bud", scale: 0.9, tilt: 4 }]),
  vine("stem-24", [[[18, 1, 12, 10, 30, 8, 28, 22], [28, 22, 22, 28, 34, 34, 24, 40]], [[26, 14, 34, 12, 36, 20, 32, 26]]], [{ at: 0.4, scale: 0.36, tilt: -10 }], [{ at: 1, kind: "blossom", scale: 0.78, tilt: 8 }]),
  vine("stem-25", [[[18, 1, 24, 3, 32, 10, 18, 16], [18, 16, 8, 20, 14, 30, 20, 38]]], [], [{ at: 1, kind: "daisy", scale: 0.66, tilt: 20 }]),
  vine("stem-26", [[[18, 1, 18, 8, 10, 10, 8, 20], [8, 20, 4, 28, 14, 32, 16, 40]]], [{ at: 1, scale: 0.55, tilt: -14 }], [{ at: 0.55, kind: "bud", scale: 0.7, tilt: 16 }]),
  vine("stem-27", [[[18, 1, 28, 14, 6, 18, 22, 34]], [[20, 12, 30, 10, 32, 18, 26, 22]]], [], [{ at: 1, kind: "blossom", scale: 0.9, tilt: -8 }]),
  vine("stem-28", [[[18, 1, 8, 14, 30, 20, 16, 36]], [[16, 14, 8, 16, 6, 24, 12, 28]]], [{ at: 1, scale: 0.48, tilt: 6 }], [{ at: 0.62, kind: "bud", scale: 0.75, tilt: -12 }]),
  vine("stem-29", [[[18, 1, 21, 6, 15, 9, 19, 14]]], [], [{ at: 1, kind: "daisy", scale: 0.5, tilt: 0 }]),
  vine("stem-30", [[[18, 1, 33, 10, 4, 16, 20, 28], [20, 28, 28, 32, 10, 36, 18, 41]]], [], [{ at: 1, kind: "blossom", scale: 0.82, tilt: 14 }]),
  vine("stem-31", [[[18, 1, 4, 9, 32, 15, 14, 27], [14, 27, 6, 33, 22, 37, 16, 41]], [[22, 12, 30, 8, 34, 16, 28, 20]]], [], [{ at: 1, kind: "daisy", scale: 0.7, tilt: -10 }]),
  vine("stem-32", [[[18, 1, 26, 2, 34, 12, 22, 18], [22, 18, 12, 22, 28, 30, 18, 39]]], [{ at: 0.5, scale: 0.34, tilt: 18 }], [{ at: 1, kind: "bud", scale: 0.85, tilt: 5 }]),
];

const layouts = Array.from({ length: 8 }, (_, index) => ({
  desktop: arrange(index + 1, 18, 6, 0.62, 1),
  mobile: arrange(index + 40, 12, 0, 0.34, 0.5),
}));

mkdirSync(root, { recursive: true });
writeFileSync(join(root, "sprite.svg"), sprite(stems));
writeFileSync(join(root, "layouts.json"), JSON.stringify(layouts));

function vine(id, paths, leaves = [], flowers = []) {
  const vines = paths.map((cubics) => ({ d: pathFrom(cubics), length: round(lengthOf(cubics)) }));
  const main = paths[0];
  const placed = (mark) => {
    const tip = pointOn(main, mark.at);
    const prev = pointOn(main, Math.max(0, mark.at - 0.08));
    const angle = (Math.atan2(tip.y - prev.y, tip.x - prev.x) * 180) / Math.PI + 90 + (mark.tilt ?? 0);
    return `translate(${round(tip.x)} ${round(tip.y)}) rotate(${round(angle)}) scale(${mark.scale})`;
  };
  return {
    id,
    vines,
    leaves: leaves.map(placed),
    flowers: flowers.map((flower) => flowerGroup(flower.kind, placed(flower))),
  };
}

function flowerGroup(kind, transform) {
  if (kind === "daisy") {
    const petals = Array.from({ length: 12 }, (_, index) =>
      `<path class="section-frame-flower" d="M0 2.6 C-1.15 1.4-1.35-3.8 0-9.2 C1.35-3.8 1.15 1.4 0 2.6" transform="rotate(${index * 30})"/>`,
    ).join("");
    return `<g class="section-frame-bloom" transform="${transform}">${petals}<circle class="section-frame-flower is-center" r="2.3"/></g>`;
  }
  if (kind === "blossom") {
    const petals = Array.from({ length: 5 }, (_, index) =>
      `<path class="section-frame-flower" d="M0 1.8 C-2.7 1.1-4-3.4 0-7.6 C4-3.4 2.7 1.1 0 1.8" transform="rotate(${index * 72})"/>`,
    ).join("");
    return `<g class="section-frame-bloom" transform="${transform}">${petals}<circle class="section-frame-flower is-center" r="1.6"/></g>`;
  }
  return `<g class="section-frame-bloom" transform="${transform}"><path class="section-frame-flower" d="M0 1 C-1.8 0.4-2.4-4.2 0-6.4 C2.4-4.2 1.8 0.4 0 1 Z"/></g>`;
}

function sprite(items) {
  const symbols = items
    .map((item) => {
      const paths = item.vines
        .map((entry) => `<path class="section-frame-vine" d="${entry.d}" data-length="${entry.length}"/>`)
        .join("");
      const leaves = item.leaves
        .map((transform) => `<path class="section-frame-leaf" d="${leafPath}" transform="${transform}"/>`)
        .join("");
      return `<symbol id="${item.id}" viewBox="0 0 36 42">${paths}${leaves}${item.flowers.join("")}</symbol>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${symbols}</svg>\n`;
}

function arrange(seed, topCount, bottomCount, minScale, maxScale) {
  const random = mulberry32(seed);
  const place = (count, edge) => {
    const spots = [];
    let cursor = 3.5;
    for (let index = 0; index < count; index += 1) {
      cursor += 3.1 + random() * (edge === "top" ? 2.4 : 6);
      if (cursor > 96) break;
      const stem = 1 + Math.floor(random() * stems.length);
      spots.push({
        id: `stem-${String(stem).padStart(2, "0")}`,
        edge,
        at: round(cursor),
        scale: round(minScale + random() * (maxScale - minScale)),
        flip: random() > 0.5,
      });
    }
    return spots;
  };
  return [...place(topCount, "top"), ...place(bottomCount, "bottom")];
}

function pathFrom(cubics) {
  const [start] = cubics;
  const curves = cubics
    .map((cubic) => `C ${round(cubic[2])} ${round(cubic[3])} ${round(cubic[4])} ${round(cubic[5])} ${round(cubic[6])} ${round(cubic[7])}`)
    .join(" ");
  return `M ${round(start[0])} ${round(start[1])} ${curves}`;
}

function lengthOf(cubics) {
  return cubics.reduce((sum, cubic) => sum + cubicLength(...cubic), 0);
}

function pointOn(cubics, at) {
  const lengths = cubics.map((cubic) => cubicLength(...cubic));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = total * at;
  for (let index = 0; index < cubics.length; index += 1) {
    if (remaining > lengths[index] && index < cubics.length - 1) {
      remaining -= lengths[index];
      continue;
    }
    const t = lengths[index] === 0 ? 1 : remaining / lengths[index];
    return cubicPoint(cubics[index], Math.min(1, Math.max(0, t)));
  }
  return cubicPoint(cubics.at(-1), 1);
}

function cubicPoint([x0, y0, x1, y1, x2, y2, x3, y3], t) {
  const mt = 1 - t;
  return {
    x: mt ** 3 * x0 + 3 * mt ** 2 * t * x1 + 3 * mt * t ** 2 * x2 + t ** 3 * x3,
    y: mt ** 3 * y0 + 3 * mt ** 2 * t * y1 + 3 * mt * t ** 2 * y2 + t ** 3 * y3,
  };
}

function cubicLength(x0, y0, x1, y1, x2, y2, x3, y3) {
  let length = 0;
  let px = x0;
  let py = y0;
  for (let step = 1; step <= 32; step += 1) {
    const point = cubicPoint([x0, y0, x1, y1, x2, y2, x3, y3], step / 32);
    length += Math.hypot(point.x - px, point.y - py);
    px = point.x;
    py = point.y;
  }
  return length;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}
