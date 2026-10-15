/* =========================================================
   Rajat & Shivani · Ring Ceremony — interactions
   ✏️  Edit everything about the event in CONFIG below.
   ========================================================= */
const CONFIG = {
  groom: "Rajat",
  bride: "Shivani",

  // Event start / end (IST). Used for countdown + "Add to Calendar".
  start: "2026-10-25T18:30:00+05:30",
  end:   "2026-10-25T23:59:00+05:30",

  weekday:  "Sunday",
  monthDay: "October 25",
  year:     "2026",
  dateShort:"25 · 10 · 2026",
  dateDots: "25 · 10 · 2026",
  timeText: "at seven o'clock in the evening",

  events: [
    { time: "5:30", ampm: "PM", title: "Guests Arrive",  note: "Welcome drinks & music",  icon: "glass" },
    { time: "",     ampm: "",   title: "Bariksha",        note: "Auspicious beginnings",   icon: "tradition" },
    { time: "",     ampm: "",   title: "Godh Bharai",     note: "Blessings & traditions",  icon: "blessings" },
    { time: "",     ampm: "",   title: "Ring Ceremony",   note: "The exchange of rings",   icon: "ring" },
    { time: "",     ampm: "",   title: "Cake Cutting",    note: "Sweet celebrations",      icon: "cake" },
    { time: "",     ampm: "",   title: "Dinner",          note: "A feast with loved ones", icon: "dinner" },
  ],

  qr: [
    { title: "Venue Map", sub: "Scan for directions", url: "https://maps.google.com/maps?ftid=0x390cefe69701b30b:0x22a1a883b60f53d1" },
  ],

  quoteText: "“Two souls, one heart — a beautiful beginning to a lifetime of togetherness.”",
  quoteSub: "Your presence and blessings are the greatest gifts we could ask for as we celebrate our love.",

  venueName: "Omnia by Tivoli",
  venueAddress: "Knowledge Park III, Greater Noida",
  mapUrl: "https://maps.google.com/maps?ftid=0x390cefe69701b30b:0x22a1a883b60f53d1",

  rsvpBy: "October 18, 2026",
  email: "rsvp@rajatandshivani.com",
  whatsapp: "", // e.g. "919876543210" (country code, no +). Empty = choose contact in WhatsApp.
};

/* ---------------- helpers ---------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const T = (ms) => (reduceMotion ? Math.min(ms, 120) : ms);

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------------- bind config text ---------------- */
$$("[data-cfg]").forEach((el) => {
  const v = CONFIG[el.dataset.cfg];
  if (v != null) el.textContent = v;
});

// Personalised greeting: add ?to=Sharma%20Family to the link
const guest = new URLSearchParams(location.search).get("to");
if (guest) $("#guestLine").textContent = `Dear ${guest.slice(0, 60)}`;

/* =========================================================
   STAGE 1 · Envelope opening
   ========================================================= */
const intro = $("#intro");
const envelope = $("#envelope");
const seal = $("#seal");
const invite = $("#invite");
let opened = false;

async function openEnvelope() {
  if (opened) return;
  opened = true;

  // 1 · the seal glows for a moment
  intro.classList.add("sealing");
  seal.classList.add("charging");
  await wait(T(300));

  // 2 · it dissolves into gold sparkles — wait until it has COMPLETELY disappeared
  seal.classList.add("dissolving");
  let gone;
  try { gone = dissolveSeal(); } catch (e) { gone = Promise.resolve(); }
  await Promise.race([gone, wait(1400)]); // safety net: never wait longer than 1.4s
  seal.classList.add("gone");             // hard-hide the seal no matter what

  // 3 · only now does the envelope open (sparkles keep floating over it)
  intro.classList.add("opening");
  await wait(T(180));
  envelope.classList.add("open-top");
  await wait(T(320));
  envelope.classList.add("open-bottom");
  await wait(T(320));
  envelope.classList.add("open-sides");

  await wait(T(900));
  envelope.classList.add("card-rise");

  await wait(T(850));
  intro.classList.add("zooming");
  invite.classList.add("show");
  invite.removeAttribute("aria-hidden");

  await wait(T(1400));
  intro.classList.add("gone");

  // ============ GANESH JI BLESSING (2 SECONDS + GLITTER DISSOLVE) ============
  await wait(T(2200)); // stays for 2 seconds with shloka and darshan
  
  // Dissolve Ganesh card into sparkling golden glitters
  const ganeshScene = $("#ganesh");
  ganeshScene.classList.add("dissolving");
  try {
    dissolveGanesh();
  } catch (err) {
    console.warn("Ganesh dissolve error", err);
  }
  await wait(T(1000));
  ganeshScene.classList.add("dissolve");
  await wait(T(1000));
  ganeshScene.classList.add("gone");

  // Now start "You're cordially invited"
  document.body.classList.remove("locked");
  playWelcome();
}
seal.addEventListener("click", openEnvelope);

/* ---------- Ganesh Card → gold glitter dissolve (canvas) ---------- */
function dissolveGanesh() {
  const card = $("#ganeshCard");
  const canvas = $("#ganeshDust");
  if (!card || !canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = card.getBoundingClientRect();
  const host = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(host.width * dpr);
  canvas.height = Math.round(host.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const ox = rect.left - host.left, oy = rect.top - host.top;
  const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
  const parts = [];

  // Spawn glittering gold particles across the card
  for (let i = 0; i < 180; i++) {
    const rx = Math.random() * w, ry = Math.random() * h;
    const ang = (Math.random() - 0.5) * Math.PI * 1.5;
    const sp = 20 + Math.random() * 85;
    parts.push({
      x: ox + rx, y: oy + ry,
      vx: Math.cos(ang) * sp,
      vy: -20 - Math.random() * 65,
      life: 1.1 + Math.random() * 1.0,
      size: 2.2 + Math.random() * 3.5,
      delay: Math.random() * 0.45,
      star: Math.random() < 0.35,
      seed: Math.random() * 6.28,
    });
  }

  const star = (x, y, s) => {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.quadraticCurveTo(x, y, x + s, y);
    ctx.quadraticCurveTo(x, y, x, y + s);
    ctx.quadraticCurveTo(x, y, x - s, y);
    ctx.quadraticCurveTo(x, y, x, y - s);
    ctx.fill();
  };

  const t0 = performance.now();
  let last = t0;
  function frame(now) {
    const t = (now - t0) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    ctx.clearRect(0, 0, host.width, host.height);
    let alive = 0;
    for (const p of parts) {
      const age = t - p.delay;
      if (age < 0) { alive++; continue; }
      const k = age / p.life;
      if (k >= 1) continue;
      alive++;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const fade = Math.pow(1 - k, 1.4);
      if (p.star) {
        const s = p.size * (0.8 + 0.4 * Math.sin(age * 12 + p.seed)) * (1 - k * 0.3);
        ctx.fillStyle = `rgba(255, 230, 160, ${fade * 0.9})`;
        star(p.x, p.y, s);
      } else {
        const s = p.size * (1 - k * 0.4);
        ctx.fillStyle = `rgba(224, 185, 95, ${fade * 0.85})`;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
    }
    if (alive > 0 && t < 3.0) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, host.width, host.height);
    }
  }
  requestAnimationFrame(frame);
}

/* ---------- Seal → gold sparkle dissolve (canvas) ---------- */
function dissolveSeal() {
  const img = $("#sealImg");
  const canvas = $("#dust");
  const ctx = canvas.getContext("2d");
  const rect = img.getBoundingClientRect();
  const host = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(host.width * dpr);
  canvas.height = Math.round(host.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const ox = rect.left - host.left, oy = rect.top - host.top;
  const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
  const SWEEP = 0.6;    // seconds for the dissolve front to cross the seal
  const LAG = 0.06;     // the image mask trails slightly behind the particles

  if (reduceMotion) {
    img.style.transition = "opacity .3s";
    img.style.opacity = "0";
    return Promise.resolve();
  }

  // sample the seal's own pixels so the sparkles carry its exact gold tones
  let data;
  try {
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const octx = off.getContext("2d", { willReadFrequently: true });
    octx.drawImage(img, 0, 0, w, h);
    data = octx.getImageData(0, 0, w, h).data;
  } catch (e) {
    data = null;
  }

  const parts = [];
  const cx = w / 2, cy = h / 2, maxD = Math.hypot(cx, cy);
  const step = Math.max(2, Math.round(w / 72));
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      let r = 214, g = 172, b = 84, a = 255;
      if (data) {
        const i = (y * w + x) * 4;
        r = data[i]; g = data[i + 1]; b = data[i + 2]; a = data[i + 3];
      } else if (Math.hypot(x - cx, y - cy) > Math.min(cx, cy)) continue;
      if (a < 140) continue;
      const d = Math.hypot(x - cx, y - cy) / maxD;
      const ang = Math.atan2(y - cy, x - cx) + (Math.random() - 0.5) * 0.9;
      const sp = 25 + Math.random() * 105;
      parts.push({
        x: ox + x, y: oy + y, r, g, b,
        delay: d * SWEEP + Math.random() * 0.06,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - (35 + Math.random() * 70),
        life: 0.9 + Math.random() * 1.1,
        size: step * (0.55 + Math.random() * 0.55),
        seed: Math.random() * 6.28,
        star: Math.random() < 0.06,
      });
    }
  }
  // a few big twinkling stars that float up from the seal
  for (let k = 0; k < 42; k++) {
    const ang = Math.random() * Math.PI * 2, rr = Math.random() * w * 0.45;
    const sp = 20 + Math.random() * 70;
    parts.push({
      x: ox + cx + Math.cos(ang) * rr, y: oy + cy + Math.sin(ang) * rr,
      r: 255, g: 236, b: 170,
      delay: 0.05 + Math.random() * SWEEP,
      vx: Math.cos(ang) * sp * 0.6, vy: -40 - Math.random() * 90,
      life: 1.4 + Math.random() * 1.3,
      size: 3 + Math.random() * 4.5, seed: Math.random() * 6.28, star: true, big: true,
    });
  }

  const star = (x, y, s) => {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.quadraticCurveTo(x, y, x + s, y);
    ctx.quadraticCurveTo(x, y, x, y + s);
    ctx.quadraticCurveTo(x, y, x - s, y);
    ctx.quadraticCurveTo(x, y, x, y - s);
    ctx.fill();
  };

  // `gone` resolves the moment the seal image is fully erased; the sparkles keep animating afterwards
  let markGone;
  const gone = new Promise((r) => (markGone = r));
  let goneDone = false;
  const finishGone = () => {
    if (goneDone) return;
    goneDone = true;
    img.style.opacity = "0";
    markGone();
  };

  new Promise((resolve) => {
    const t0 = performance.now();
    let last = t0;
    function frame(now) {
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // erase the seal image from the centre outwards, just behind the sparkles
      const m = Math.max(0, (t - LAG) / SWEEP) * 100;
      const mask = `radial-gradient(circle at 50% 50%, transparent ${m}%, #000 ${m + 7}%)`;
      img.style.webkitMaskImage = mask;
      img.style.maskImage = mask;
      if (m >= 108) finishGone();

      ctx.clearRect(0, 0, host.width, host.height);
      let alive = 0;
      const drag = Math.pow(0.35, dt);
      for (const p of parts) {
        const age = t - p.delay;
        if (age < 0) { alive++; continue; }
        const k = age / p.life;
        if (k >= 1) continue;
        alive++;
        p.vx = p.vx * drag + Math.sin(t * 3 + p.seed) * 14 * dt;
        p.vy = p.vy * drag - 30 * dt; // gentle upward float
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const fade = Math.pow(1 - k, 1.3);
        // colours warm towards pale champagne as they fly
        const mix = Math.min(1, k * 0.9 + 0.15);
        const r = p.r + (255 - p.r) * mix, g = p.g + (238 - p.g) * mix, b = p.b + (180 - p.b) * mix;
        if (p.star) {
          const tw = 0.6 + 0.4 * Math.sin(age * 14 + p.seed);
          const s = p.size * (p.big ? 1 : 1.6) * tw * (1 - k * 0.4);
          ctx.fillStyle = `rgba(255, 226, 150, ${0.25 * fade})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, s * 1.6, 0, 6.283); ctx.fill();
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${fade})`;
          star(p.x, p.y, s * 1.4);
        } else {
          const s = p.size * (1 - k * 0.5);
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${fade})`;
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        }
      }
      if (alive > 0 && t < 4.5) requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, host.width, host.height); finishGone(); resolve(); }
    }
    requestAnimationFrame(frame);
  });
  setTimeout(finishGone, (LAG + SWEEP) * 1000 + 250); // in case animation frames are throttled
  return gone;
}

/* =========================================================
   SCENE 2 · Welcome text sequence
   ========================================================= */
async function playWelcome() {
  const [l1, l2, l3] = [".wl-1", ".wl-2", ".wl-3"].map((s) => $(s));
  l1.classList.add("play");
  await wait(T(2500));
  l2.classList.add("play");
  await wait(T(2500));
  l3.classList.add("play");
  await wait(T(1400));
  $(".scroll-cue").classList.add("show");
}

/* =========================================================
   SCENE 3 · Countdown
   ========================================================= */
const target = new Date(CONFIG.start).getTime();
function tick() {
  let d = Math.max(0, target - Date.now());
  const days = Math.floor(d / 864e5); d -= days * 864e5;
  const hrs = Math.floor(d / 36e5); d -= hrs * 36e5;
  const min = Math.floor(d / 6e4); d -= min * 6e4;
  const sec = Math.floor(d / 1e3);
  const p = (n) => String(n).padStart(2, "0");
  $("#cdD").textContent = p(days);
  $("#cdH").textContent = p(hrs);
  $("#cdM").textContent = p(min);
  $("#cdS").textContent = p(sec);
}
tick();
setInterval(tick, 1000);

/* =========================================================
   SCENE 4 · Timeline
   ========================================================= */
const ICONS = {
  glass: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0z"/><path d="M12 14v6M8.5 21h7"/>',
  ring: '<circle cx="12" cy="15" r="6"/><path d="M9.5 6.5L12 3l2.5 3.5L12 9z"/>',
  dinner: '<circle cx="12" cy="12" r="5.5"/><path d="M3 3v5a1.5 1.5 0 0 0 3 0V3M4.5 8v13M21 3c-2 1-2.5 5-2.5 8H21v10"/>',
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s2-1 4-1 4 1 4 1 2-1 4-1 4 1 4 1"/><path d="M2 21h20"/><circle cx="12" cy="4" r="1.5"/><path d="M12 7v4"/>',
  tradition: '<path d="M12 2a5 5 0 0 1 5 5c0 3-5 9-5 9s-5-6-5-9a5 5 0 0 1 5-5z"/><circle cx="12" cy="7" r="2"/><path d="M5 22h14"/>',
  blessings: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  fireworks: '<path d="M12 2v5M12 17v5M2 12h5M17 12h5M4.9 4.9l3.5 3.5M15.6 15.6l3.5 3.5M4.9 19.1l3.5-3.5M15.6 8.4l3.5-3.5"/>',
};
$("#timeline").innerHTML = CONFIG.events
  .map(
    (e, i) => `
  <li class="tl-item" style="--i:${i}">
    <div class="tl-time">${e.time ? `${e.time}<small>${e.ampm}</small>` : `<span class="tl-time-dot">✦</span>`}</div>
    <div class="tl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[e.icon] || ICONS.ring}</svg></div>
    <div class="tl-text"><strong>${e.title}</strong><span>${e.note}</span></div>
  </li>`
  )
  .join("");

/* =========================================================
   SCENE 5 · QR codes, map, calendar
   ========================================================= */
CONFIG.qr.forEach((q, i) => {
  const card = $(`#qr${i + 1}`);
  if (!card) return;
  card.href = q.url;
  $(".qr-title", card).textContent = q.title;
  $(".qr-sub", card).textContent = q.sub;
  try {
    const qr = qrcode(0, "M");
    qr.addData(q.url);
    qr.make();
    $(".qr", card).innerHTML = qr
      .createSvgTag({ cellSize: 4, margin: 8, scalable: true })
      .replace('fill="white"', 'fill="#fffaf2"')
      .replace('fill="black"', 'fill="#5a0d1b"');
  } catch (err) {
    console.warn("QR failed", err);
  }
});

$("#mapBtn").href = CONFIG.mapUrl;

$("#calBtn").addEventListener("click", () => {
  const f = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RajatShivani//Invite//EN", "BEGIN:VEVENT",
    `UID:${Date.now()}@rajat-shivani`,
    `DTSTAMP:${f(new Date().toISOString())}`,
    `DTSTART:${f(CONFIG.start)}`,
    `DTEND:${f(CONFIG.end)}`,
    `SUMMARY:Ring Ceremony · ${CONFIG.groom} & ${CONFIG.bride}`,
    `LOCATION:${CONFIG.venueName}\\, ${CONFIG.venueAddress.replace(/,/g, "\\,")}`,
    `DESCRIPTION:We can't wait to celebrate with you! RSVP by ${CONFIG.rsvpBy}.`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "rajat-shivani-ring-ceremony.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast("Saved to your calendar ✨");
});



/* =========================================================
   SCENE 7 · Gold wreath (generated SVG)
   ========================================================= */
function buildWreath() {
  const NS = "http://www.w3.org/2000/svg";
  const cx = 200, cy = 270, rx = 168, ry = 236;
  const rad = (d) => (d * Math.PI) / 180;
  const vines = $("#wreathVines"), leaves = $("#wreathLeaves"), flowers = $("#wreathFlowers");
  const DRAW = 3.2; // seconds the vine takes to draw

  const pt = (t, k = 1, wob = 0.012, ph = 0) => {
    const r = k * (1 + wob * Math.sin(t * 7 + ph));
    return [cx + rx * r * Math.cos(t), cy + ry * r * Math.sin(t)];
  };
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  const branches = [
    { t0: rad(98), t1: rad(266) },  // left side, bottom → top
    { t0: rad(82), t1: rad(-86) },  // right side, bottom → top
  ];

  branches.forEach((b, bi) => {
    // main + thin companion vine
    [[1, 0.012, 0, ""], [0.975, 0.02, 1.7, "thin"]].forEach(([k, wob, ph, cls]) => {
      let d = "";
      for (let i = 0; i <= 140; i++) {
        const t = b.t0 + ((b.t1 - b.t0) * i) / 140;
        const [x, y] = pt(t, k, wob, ph);
        d += (i ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2);
      }
      const p = el("path", { d, class: `vine ${cls}` });
      vines.appendChild(p);
      p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 1);
    });

    // leaves
    const N = 30;
    const dir = Math.sign(b.t1 - b.t0);
    for (let i = 0; i <= N; i++) {
      const s = 0.03 + (i / N) * 0.97;
      const t = b.t0 + (b.t1 - b.t0) * s;
      const [x, y] = pt(t);
      const tx = -rx * Math.sin(t) * dir, ty = ry * Math.cos(t) * dir;
      const tang = (Math.atan2(ty, tx) * 180) / Math.PI;
      const side = i % 2 ? 1 : -1;
      const size = (1.15 - s * 0.55) * (0.9 + 0.2 * Math.sin(i * 2.3));
      const g = el("g", { transform: `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(tang + side * 38).toFixed(1)}) scale(${size.toFixed(3)})` });
      const leaf = el("path", {
        d: "M0 0 C5 -7.5 15 -7.5 24 0 C15 7.5 5 7.5 0 0 Z",
        class: "leaf" + (i % 5 === 2 ? " outline" : ""),
      });
      leaf.style.setProperty("--d", (0.25 + s * DRAW * 0.95).toFixed(2) + "s");
      g.appendChild(leaf);
      if (i % 5 === 2) g.appendChild(el("path", { d: "M1 0 L22 0", class: "leaf outline", style: `--d:${(0.25 + s * DRAW * 0.95).toFixed(2)}s` }));
      leaves.appendChild(g);
    }
    // tip leaf
    {
      const t = b.t1, [x, y] = pt(t);
      const tx = -rx * Math.sin(t) * dir, ty = ry * Math.cos(t) * dir;
      const g = el("g", { transform: `translate(${x} ${y}) rotate(${(Math.atan2(ty, tx) * 180) / Math.PI}) scale(.7)` });
      const leaf = el("path", { d: "M0 0 C5 -6 15 -6 24 0 C15 6 5 6 0 0 Z", class: "leaf" });
      leaf.style.setProperty("--d", (0.25 + DRAW).toFixed(2) + "s");
      g.appendChild(leaf);
      leaves.appendChild(g);
    }

    // white flowers + gold berries
    [0.14, 0.32, 0.5, 0.67, 0.83, 0.95].forEach((s, j) => {
      const t = b.t0 + (b.t1 - b.t0) * s;
      const out = j % 2 ? 1.045 : 0.955;
      const [x, y] = pt(t, out, 0);
      const sz = (j % 3 === 0 ? 8.5 : 6.5) * (1.1 - s * 0.35);
      flowers.appendChild(makeFlower(x, y, sz, 0.6 + s * DRAW + 0.35, j + bi));
      // berries
      const [bx, by] = pt(t + 0.07 * Math.sign(b.t1 - b.t0), j % 2 ? 0.94 : 1.06, 0);
      [[0, 0], [4, 3], [-2, 5]].forEach(([ox, oy]) => {
        const c = el("circle", { cx: (bx + ox).toFixed(1), cy: (by + oy).toFixed(1), r: 1.7, class: "berry" });
        c.style.setProperty("--d", (0.8 + s * DRAW).toFixed(2) + "s");
        flowers.appendChild(c);
      });
    });
  });

  // bottom cluster where the branches meet
  flowers.appendChild(makeFlower(cx, cy + ry + 2, 11, 0.35, 0));
  flowers.appendChild(makeFlower(cx - 15, cy + ry - 4, 6.5, 0.5, 1));
  flowers.appendChild(makeFlower(cx + 15, cy + ry - 4, 6.5, 0.55, 2));
  // a tiny flower crowning the top gap
  flowers.appendChild(makeFlower(cx, cy - ry, 7, DRAW + 0.6, 3));

  function makeFlower(x, y, r, delay, seed) {
    const wrap = el("g", { transform: `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(seed * 37) % 72})` });
    const f = el("g", { class: "flower" });
    f.style.setProperty("--d", delay.toFixed(2) + "s");
    for (let k = 0; k < 5; k++) {
      f.appendChild(el("ellipse", { cx: 0, cy: -r * 0.55, rx: r * 0.42, ry: r * 0.62, transform: `rotate(${k * 72})`, class: "petal" }));
    }
    f.appendChild(el("circle", { cx: 0, cy: 0, r: r * 0.28, class: "core" }));
    wrap.appendChild(f);
    return wrap;
  }
}
buildWreath();

// gold sparkles
(function sparkles() {
  const box = $("#sparkles");
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = 10 + Math.random() * 85 + "%";
    s.style.setProperty("--t", 3 + Math.random() * 4 + "s");
    s.style.setProperty("--d", -Math.random() * 6 + "s");
    box.appendChild(s);
  }
})();

$("#replay").addEventListener("click", () => {
  window.scrollTo(0, 0);
  location.reload();
});

/* =========================================================
   Scroll reveals
   ========================================================= */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const t = en.target;
      if (t.id === "wreathWrap") {
        t.classList.add("in");
        $("#wreath").classList.add("in");
      } else t.classList.add("in");
      io.unobserve(t);
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
);
$$(".reveal, .reveal-fade, #timeline, #wreathWrap").forEach((n) => io.observe(n));
