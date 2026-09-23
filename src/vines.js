import gsap from "gsap";

const SVG_NS = "http://www.w3.org/2000/svg";

const ROOTS = [
  { weight: "heavy", base: 4, amp: 5, phase: 0.4 },
  { weight: "heavy", base: 9, amp: 6, phase: 1.6 },
  { weight: "main", base: 12, amp: 7, phase: 2.4 },
  { weight: "main", base: 17, amp: 6, phase: 0.7 },
  { weight: "mid", base: 7, amp: 7, phase: 3.2 },
];

export function mountVineFrame(container) {
  const width = Math.round(window.innerWidth);
  const height = Math.round(window.innerHeight);
  const frame = svg("svg", {
    class: "vine-frame",
    "aria-hidden": "true",
    focusable: "false",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "none",
  });
  container.append(frame);
  gsap.context(() => build(frame, width, height), frame);
}

function build(frame, width, height) {
  const stems = svg("g", { class: "vine-stems" });
  const leaves = svg("g", { class: "vine-leaves" });
  const flowers = svg("g", { class: "vine-flowers" });
  const dots = svg("g", { class: "vine-dots" });
  frame.append(stems, leaves, flowers, dots);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tl = gsap.timeline({ paused: true });
  const band = Math.min(96, Math.min(width, height) * 0.14);

  edges(width, height).forEach((edge, edgeIndex) => {
    ROOTS.forEach((root, rootIndex) => {
      growPath(stems, tl, smoothPath(braidPoints(edge, root, edgeIndex + rootIndex)), {
        weight: root.weight,
        start: edgeIndex * 0.04,
        duration: 0.85,
        reduced,
      });
    });

    positions(edge.span, 62, edgeIndex).forEach((along, index) => {
      const roll = hash(edgeIndex + 3, index);
      const turn = roll > 0.5 ? 1 : -1;
      const reach = band * (0.34 + roll * 0.7);
      const start = at(edge, along, 8 + hash(edgeIndex, index + 9) * 6);
      const when = 0.2 + edgeIndex * 0.04 + (index % 5) * 0.035;
      const shoot = growPath(stems, tl, smoothPath(shootPoints(start, edge, reach, turn, roll)), {
        weight: "main",
        start: when,
        reduced,
      });

      dressShoot(leaves, flowers, tl, shoot, {
        turn,
        roll,
        when,
        reduced,
        flower: roll > 0.38 ? (roll > 0.78 ? "daisy" : "blossom") : roll > 0.2 ? "bud" : null,
      });

      if (roll > 0.58) {
        const branchAt = shoot.length * (0.34 + hash(index, edgeIndex) * 0.2);
        const origin = shoot.path.getPointAtLength(Math.min(shoot.length - 1, branchAt));
        const branch = growPath(stems, tl, smoothPath(branchPoints(origin, edge, reach * 0.46, -turn, roll)), {
          weight: "fine",
          start: when + (branchAt / Math.max(shoot.length, 1)) * shoot.duration,
          reduced,
        });
        dressShoot(leaves, flowers, tl, branch, {
          turn: -turn,
          roll: roll + 0.2,
          when: when + 0.12,
          reduced,
          flower: roll > 0.6 ? "bud" : null,
          leaves: 2,
        });
      }

      if (roll > 0.67) {
        const tip = shoot.path.getPointAtLength(Math.max(0, shoot.length - 1));
        const angle = tipAngle(shoot.path, shoot.length);
        growPath(stems, tl, smoothPath(spiralPoints(tip, angle, turn, roll > 0.8 ? 1.15 : 0.8, 7 + roll * 4)), {
          weight: "fine",
          start: when + shoot.duration * 0.72,
          duration: 0.45,
          reduced,
        });
      }
    });

    positions(edge.span, 110, edgeIndex + 11).forEach((along, index) => {
      const roll = hash(edgeIndex + 8, index);
      const origin = at(edge, along, 4 + roll * 10);
      const angle = Math.atan2(edge.inward.y, edge.inward.x) + (roll > 0.5 ? 0.8 : -0.8);
      growPath(stems, tl, smoothPath(spiralPoints(origin, angle, roll > 0.5 ? 1 : -1, 0.9, 6 + roll * 3)), {
        weight: "fine",
        start: 0.12 + (index % 4) * 0.02,
        duration: 0.4,
        reduced,
      });
    });

    positions(edge.span, 70, edgeIndex + 21).forEach((along, index) => {
      const roll = hash(edgeIndex + 15, index);
      const inward = band * (0.28 + roll * 0.38);
      stipple(dots, tl, at(edge, along + (roll - 0.5) * 18, inward), 6 + Math.floor(roll * 6), 7 + roll * 5, roll, reduced, 0.45 + index * 0.02);
    });
  });

  if (!reduced && tl.duration() > 0) {
    gsap.to(tl, {
      totalProgress: 1,
      duration: tl.duration() * 12,
      ease: "expo.out",
    });
  }
}

function braidPoints(edge, root, salt) {
  const points = [];
  for (let along = -12; along <= edge.span + 12; along += 14) {
    const wave =
      Math.sin(along * 0.048 + root.phase + salt) * root.amp +
      Math.sin(along * 0.105 + root.phase * 1.8) * root.amp * 0.42;
    points.push(at(edge, along, clamp(root.base + wave, 0, 28)));
  }
  return points;
}

function shootPoints(start, edge, reach, turn, roll) {
  const points = [start];
  let x = start.x;
  let y = start.y;
  let angle = Math.atan2(edge.inward.y, edge.inward.x) + turn * (0.18 + roll * 0.55);
  const steps = 10;

  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    const curl = t < 0.48 ? 0.03 : (t - 0.48) * (t - 0.48) * 7.2;
    angle += turn * curl * (0.75 + roll);
    const distance = (reach / steps) * (t < 0.75 ? 1.18 : 0.82);
    x += Math.cos(angle) * distance;
    y += Math.sin(angle) * distance;
    points.push({ x, y });
  }

  return points;
}

function branchPoints(start, edge, reach, turn, roll) {
  const points = [start];
  let x = start.x;
  let y = start.y;
  let angle = Math.atan2(edge.inward.y, edge.inward.x) + turn * (0.7 + roll * 0.4);
  const steps = 5;

  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    angle += turn * (0.18 + t * 0.35);
    const distance = (reach / steps) * (1.05 - t * 0.25);
    x += Math.cos(angle) * distance;
    y += Math.sin(angle) * distance;
    points.push({ x, y });
  }

  return points;
}

function spiralPoints(origin, angle, turn, turns, radius) {
  const points = [origin];
  let x = origin.x;
  let y = origin.y;
  let a = angle;
  const steps = Math.max(8, Math.round(turns * 9));

  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    a += turn * ((Math.PI * 2 * turns) / steps);
    const distance = radius * (1 - t * 0.78) * 0.62;
    x += Math.cos(a) * distance;
    y += Math.sin(a) * distance;
    points.push({ x, y });
  }

  return points;
}

function dressShoot(leaves, flowers, tl, grown, opts) {
  const { path, length, duration, start } = grown;
  if (length < 16) return;

  const count = opts.leaves ?? 5;
  for (let index = 0; index < count; index += 1) {
    const dist = length * (0.22 + (index / Math.max(count - 1, 1)) * 0.62);
    const point = path.getPointAtLength(Math.min(length - 1, dist));
    const ahead = path.getPointAtLength(Math.min(length - 0.4, dist + 6));
    const tangent = Math.atan2(ahead.y - point.y, ahead.x - point.x);
    const side = index % 2 === 0 ? opts.turn : -opts.turn;
    placeLeaf(leaves, tl, {
      x: point.x,
      y: point.y,
      rotation: (tangent * 180) / Math.PI + side * 34 + 90,
      scale: 0.55 + hash(index + 2, Math.round(opts.roll * 20)) * 0.35,
      time: start + (dist / length) * duration,
      reduced: opts.reduced,
    });
  }

  if (!opts.flower) return;
  const tipDist = opts.flower === "bud" ? length * 0.62 : length - 1;
  const tip = path.getPointAtLength(Math.max(0, Math.min(length - 1, tipDist)));
  placeFlower(flowers, tl, {
    x: tip.x,
    y: tip.y,
    kind: opts.flower,
    scale: opts.flower === "daisy" ? 0.85 : opts.flower === "blossom" ? 0.7 : 0.52,
    time: start + duration * (opts.flower === "bud" ? 0.62 : 0.84),
    reduced: opts.reduced,
  });
}

function growPath(parent, tl, d, { weight, start, duration, reduced }) {
  const path = svg("path", {
    class: `ink stem stem--${weight}`,
    d,
  });
  parent.append(path);
  const length = d ? path.getTotalLength() : 0;
  const time = duration ?? Math.max(0.32, length / 280);
  if (!reduced && length > 1) {
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    tl.to(path, { strokeDashoffset: 0, duration: time, ease: "none" }, start);
  }
  return { path, length, duration: time, start };
}

function placeLeaf(layer, tl, opts) {
  const group = svg("g", { class: "leaf" });
  group.append(
    svg("path", {
      class: "ink leaf-shape",
      d: "M0 0 C-3.4-5.2-4.6-13.5 0-20.5 C4.6-13.5 3.4-5.2 0 0 Z",
    }),
    svg("path", {
      class: "ink leaf-shape leaf-vein",
      d: "M0-1.5 L0-16",
    }),
  );
  layer.append(group);
  group.setAttribute(
    "transform",
    `translate(${round(opts.x)} ${round(opts.y)}) rotate(${round(opts.rotation)}) scale(${round(opts.scale)})`,
  );
  group.querySelectorAll("path").forEach((shape, index) => {
    drawInk(shape, tl, opts.time + index * 0.02, 0.28, opts.reduced);
  });
}

function placeFlower(layer, tl, opts) {
  const group = svg("g", { class: "flower" });
  if (opts.kind === "daisy") {
    addPetals(group, 12, "M0 2.6 C-1.15 1.4-1.35-3.8 0-9.2 C1.35-3.8 1.15 1.4 0 2.6");
    group.append(svg("circle", { class: "ink flower-shape", r: "2.3" }));
  } else if (opts.kind === "blossom") {
    addPetals(group, 5, "M0 1.8 C-2.7 1.1-4-3.4 0-7.6 C4-3.4 2.7 1.1 0 1.8");
    group.append(svg("circle", { class: "ink flower-shape", r: "1.6" }));
  } else {
    group.append(
      svg("path", {
        class: "ink flower-shape",
        d: "M0 1 C-1.8 0.4-2.4-4.2 0-6.4 C2.4-4.2 1.8 0.4 0 1 Z",
      }),
    );
  }
  layer.append(group);
  group.setAttribute(
    "transform",
    `translate(${round(opts.x)} ${round(opts.y)}) rotate(${round(hash(opts.x, opts.y) * 360)}) scale(${round(opts.scale)})`,
  );
  group.querySelectorAll(".flower-shape").forEach((shape, index) => {
    drawInk(shape, tl, opts.time + index * 0.025, 0.26, opts.reduced);
  });
}

function addPetals(group, count, d) {
  for (let index = 0; index < count; index += 1) {
    group.append(
      svg("path", {
        class: "ink flower-shape",
        d,
        transform: `rotate(${index * (360 / count)})`,
      }),
    );
  }
}

function stipple(layer, tl, origin, count, spread, seed, reduced, time) {
  for (let index = 0; index < count; index += 1) {
    const angle = hash(seed, index) * Math.PI * 2;
    const radius = hash(index, seed + 4) * spread;
    const dot = svg("circle", {
      class: "dot",
      cx: round(origin.x + Math.cos(angle) * radius),
      cy: round(origin.y + Math.sin(angle) * radius),
      r: round(0.45 + hash(index + 3, seed) * 0.55),
    });
    layer.append(dot);
    if (reduced) continue;
    gsap.set(dot, { opacity: 0 });
    tl.to(dot, { opacity: 0.85, duration: 0.25, ease: "none" }, time + index * 0.015);
  }
}

function drawInk(path, tl, time, duration, reduced) {
  const length = path.getTotalLength();
  if (reduced || !(length > 1)) return;
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  tl.to(path, { strokeDashoffset: 0, duration, ease: "none" }, time);
}

function edges(width, height) {
  return [
    { origin: { x: 0, y: 0 }, along: { x: 1, y: 0 }, inward: { x: 0, y: 1 }, span: width },
    { origin: { x: width, y: 0 }, along: { x: 0, y: 1 }, inward: { x: -1, y: 0 }, span: height },
    { origin: { x: width, y: height }, along: { x: -1, y: 0 }, inward: { x: 0, y: -1 }, span: width },
    { origin: { x: 0, y: height }, along: { x: 0, y: -1 }, inward: { x: 1, y: 0 }, span: height },
  ];
}

function at(edge, along, inward) {
  return {
    x: edge.origin.x + edge.along.x * along + edge.inward.x * inward,
    y: edge.origin.y + edge.along.y * along + edge.inward.y * inward,
  };
}

function positions(span, gap, seed) {
  const list = [];
  let along = gap * (0.25 + hash(seed, 0) * 0.35);
  let index = 0;
  while (along < span - gap * 0.2) {
    list.push(along);
    along += gap * (0.68 + hash(seed, index + 1) * 0.6);
    index += 1;
  }
  return list;
}

function tipAngle(path, length) {
  const end = path.getPointAtLength(Math.max(0, length - 1));
  const before = path.getPointAtLength(Math.max(0, length - 8));
  return Math.atan2(end.y - before.y, end.x - before.x);
}

function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.x)} ${round(p2.y)}`;
  }
  return d;
}

function hash(a, b) {
  const value = Math.sin(Number(a) * 127.1 + Number(b) * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  return Number(value).toFixed(1);
}

function svg(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}
