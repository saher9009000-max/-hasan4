/* ══════ سُكون للعزل الصوتي — السلوكيات (بدون أي مكتبات) ══════ */
"use strict";

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* الهيدر والقائمة */
const header = $("#siteHeader");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 40), { passive: true });
const navToggle = $("#navToggle"), siteNav = $("#siteNav");
navToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
});
$$(".site-nav a").forEach(a => a.addEventListener("click", () => siteNav.classList.remove("open")));

/* تبديل الوضع الفاتح/الداكن */
const themeToggle = $("#themeToggle");
const rootEl = document.documentElement;
function syncThemeIcon() {
  themeToggle.setAttribute("aria-label",
    rootEl.dataset.theme === "light" ? "التبديل إلى الوضع الداكن" : "التبديل إلى الوضع الفاتح");
}
themeToggle.addEventListener("click", () => {
  rootEl.dataset.theme = rootEl.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("sukoon-theme", rootEl.dataset.theme);
  syncThemeIcon();
});
syncThemeIcon();

/* كانفاس الموجات في الافتتاحية */
const canvas = $("#waveCanvas"), ctx = canvas.getContext("2d");
let W, H, phase = 0, energy = 1;
function sizeCanvas() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sizeCanvas();
window.addEventListener("resize", () => { sizeCanvas(); if (REDUCED) drawWave(); });

function lerpColor(t) {
  const a = [255, 107, 53], b = [45, 212, 191];
  return a.map((c, i) => Math.round(lerp(c, b[i], t))).join(",");
}
function drawWave() {
  ctx.clearRect(0, 0, W, H);
  const mid = H * 0.55, t = 1 - energy;
  const layers = [
    { amp: lerp(64, 7, t), freq: .011, speed: 1,   alpha: .85 },
    { amp: lerp(40, 5, t), freq: .017, speed: 1.6, alpha: .5  },
    { amp: lerp(24, 3, t), freq: .026, speed: 2.3, alpha: .3  }
  ];
  const rgb = lerpColor(t);
  layers.forEach((L, li) => {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 4) {
      const y = mid + Math.sin(x * L.freq + phase * L.speed) * L.amp
        + Math.sin(x * .09 + phase * 2.2 + li) * L.amp * .35 * energy;