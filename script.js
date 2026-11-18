const CONFIG = {
  heroImage:    "10.jpg",     
  teacherImage: "co-chi.jpg", 
  music:        "audio.mp3",        
  memories: [
    { src: "1.jpg", caption: "Memory 01", size: "wide" },
    { src: "2.jpg", caption: "Memory 02", size: "" },
    { src: "3.jpg", caption: "Memory 03", size: "tall" },
    { src: "4.jpg", caption: "Memory 04", size: "" },
    { src: "5.jpg", caption: "Memory 05", size: "" },
    { src: "6.jpg", caption: "Memory 06", size: "wide" },
    { src: "7.jpg", caption: "Memory 07", size: "tall" },
    { src: "8.jpg", caption: "Memory 08", size: "" },
    { src: "9.jpg", caption: "Memory 09", size: "" },
    { src: "10.jpg", caption: "Memory 10", size: "" },
    { src: "11.jpg", caption: "Memory 11", size: "wide" },
    { src: "12.jpg", caption: "Memory 12", size: "" }
  ]
};
/* ================= HẾT KHU VỰC CẤU HÌNH ================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Ảnh hero & ảnh cô ---------- */
if (CONFIG.heroImage) $("#heroBg").style.backgroundImage = `url("${CONFIG.heroImage}")`;
const tImg = $("#teacherImg");
tImg.src = CONFIG.teacherImage;
tImg.addEventListener("error", () => tImg.remove()); 
const gallery = $("#gallery");
const STICKERS = ["🌸", "💗", "⭐", "🍃", "🎀", "✨"];
const rots = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2, -2.2, 2, -1.4, 1.6, -2, 1.3];
CONFIG.memories.forEach((m, i) => {
  const fig = document.createElement("figure");
  fig.className = `polaroid ${m.size || ""}`.trim();
  fig.style.setProperty("--rot", rots[i % rots.length] + "deg");
  fig.tabIndex = 0;
  fig.setAttribute("role", "button");
  fig.setAttribute("aria-label", "Xem ảnh: " + m.caption);
  fig.innerHTML = `<div class="pic"><span class="ph">${m.caption}</span><img loading="lazy" alt=""></div><figcaption></figcaption>`;
  const img = $("img", fig);
  img.alt = m.caption;
  img.src = m.src;
  img.addEventListener("error", () => fig.classList.add("empty"));
  $("figcaption", fig).textContent = m.caption;
  if (i % 2 === 0) { 
    const gs = document.createElement("span");
    gs.className = "gs"; gs.setAttribute("aria-hidden", "true");
    gs.textContent = STICKERS[(i / 2) % STICKERS.length];
    fig.appendChild(gs);
  }
  fig.addEventListener("click", () => openLB(i));
  fig.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(i); } });
  gallery.appendChild(fig);
});

const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbPh = $("#lbPh"), lbFig = $(".lb-fig");
let cur = 0, lastFocus = null;
function showLB(i) {
  const n = CONFIG.memories.length;
  cur = (i + n) % n;
  const m = CONFIG.memories[cur];
  lbFig.classList.remove("empty");
  lbImg.onerror = () => lbFig.classList.add("empty");
  lbImg.src = m.src;
  lbImg.alt = m.caption;
  lbPh.textContent = m.caption;
  lbCap.textContent = `${m.caption}  (${cur + 1}/${n})`;
}
function openLB(i) {
  lastFocus = document.activeElement;
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  showLB(i);
  $("#lbClose").focus();
}
function closeLB() {
  lb.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
$("#lbClose").onclick = closeLB;
$("#lbPrev").onclick = () => showLB(cur - 1);
$("#lbNext").onclick = () => showLB(cur + 1);
lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowLeft") showLB(cur - 1);
  if (e.key === "ArrowRight") showLB(cur + 1);
});
let sx = 0;
lb.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener("touchend", e => {
  const d = e.changedTouches[0].clientX - sx;
  if (Math.abs(d) > 50) showLB(cur + (d < 0 ? 1 : -1));
});

(function petals() {
  if (reduceMotion) return;
  const box = $("#petals");
  const count = innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    p.className = "petal";
    const s = 0.7 + Math.random() * 0.9;
    p.style.cssText = `left:${Math.random() * 100}%;--dx:${Math.random() * 160 - 80}px;` +
      `animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 18}s;` +
      `width:${12 * s}px;height:${16 * s}px;opacity:${0.25 + Math.random() * 0.3}`;
    box.appendChild(p);
  }
})();

const nav = $("#nav"), burger = $("#burger"), menu = $("#menu"), topBtn = $("#topBtn");
const links = $$("a", menu);
const sections = links.map(a => $(a.getAttribute("href")));
const heroBg = $("#heroBg");
let ticking = false;
function onScroll() {
  const y = scrollY;
  nav.classList.toggle("scrolled", y > 40);
  topBtn.classList.toggle("show", y > 600);
  if (!reduceMotion && y < innerHeight * 1.2) heroBg.style.transform = `translate3d(0,${y * 0.25}px,0)`; // parallax nhẹ
  let idx = 0;
  sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) idx = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === idx));
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
}
burger.onclick = () => setMenu(!menu.classList.contains("open"));
links.forEach(a => a.addEventListener("click", () => setMenu(false)));
topBtn.onclick = () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.08 + "s"; io.observe(el); });

const env = $("#envelope"), wrap = $("#letterWrap"), btn = $("#letterBtn");
$$("#paper > *").forEach((el, i) => el.style.setProperty("--i", i));
let isOpen = false, openTimer = null;

const paper = $("#paper");
const paras = $$("#paper p");
const fullText = paras.map(p => p.textContent);
const WRITE_SPEED = 26;
paras.forEach(p => {
  p.textContent = "";
  const t = document.createElement("span"), r = document.createElement("span");
  t.className = "t"; r.className = "r";
  p.append(t, r);
});
function paint(i, n) { paras[i].firstChild.textContent = fullText[i].slice(0, n); paras[i].lastChild.textContent = fullText[i].slice(n); }
function fillAll() { paras.forEach((_, i) => paint(i, fullText[i].length)); }
function resetAll() { paras.forEach((_, i) => paint(i, 0)); }
let writeTimer = null;
function stopWriting() {
  clearTimeout(writeTimer); writeTimer = null;
  paper.classList.remove("writing");
  paras.forEach(p => p.classList.remove("cur"));
}
function startWriting() {
  stopWriting(); resetAll();
  if (reduceMotion) { fillAll(); return; }
  paper.classList.add("writing");
  let pi = 0, ci = 0;
  (function step() {
    if (pi >= paras.length) { stopWriting(); return; }
    const txt = fullText[pi];
    paras.forEach((p, k) => p.classList.toggle("cur", k === pi));
    ci++;
    paint(pi, ci);
    if (ci >= txt.length) { pi++; ci = 0; writeTimer = setTimeout(step, 450); }
    else writeTimer = setTimeout(step, /[,.!]/.test(txt[ci - 1]) ? 170 : WRITE_SPEED);
  })();
}
paper.addEventListener("click", () => { if (paper.classList.contains("writing")) { stopWriting(); fillAll(); } });
resetAll();
function setLetter(open) {
  isOpen = open;
  env.classList.toggle("open", open);
  wrap.classList.toggle("show", open);
  btn.textContent = open ? "ĐÓNG BỨC THƯ" : "MỞ BỨC THƯ";
  btn.setAttribute("aria-expanded", open);
  clearTimeout(openTimer);
  if (open) {
    setTimeout(() => $("#paper").scrollIntoView({ behavior: "smooth", block: "center" }), 700);
    openTimer = setTimeout(startWriting, 1200);
  } else {
    stopWriting();
    $("#letter").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
btn.onclick = () => setLetter(!isOpen);
$("#seal").onclick = () => { if (!isOpen) setLetter(true); };
$("#closeLetter").onclick = () => setLetter(false);

const bgm = $("#bgm"), musicBtn = $("#musicBtn"), toast = $("#toast");
let toastTimer;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
bgm.src = CONFIG.music;
bgm.volume = 0.5;
function setPlaying(on) {
  musicBtn.classList.toggle("playing", on);
  musicBtn.setAttribute("aria-label", on ? "Tắt nhạc nền" : "Bật nhạc nền");
}
musicBtn.onclick = () => {
  if (!bgm.paused) { bgm.pause(); setPlaying(false); return; }
  bgm.play().then(() => setPlaying(true)).catch(() => {
    setPlaying(false);
  });
};
