// Test (driftless-grid.html only): clicking a grid photo opens an overlay with
// every photo in one sideways-scrolling row, like the other galleries, with
// the chosen photo centred in the window. Each photo fits the window.
// Scroll with a trackpad, mouse wheel, finger or by dragging with the mouse;
// click a photo to centre it, arrow keys step one photo, and clicking the
// background, a photo's top-right corner (or Esc) closes it.
const photos = [...document.querySelectorAll("main img.photo")];
const box = document.createElement("dialog");
box.className = "lightbox";
const row = document.createElement("div");
row.className = "lightbox-row";
for (const p of photos) {
  const img = p.cloneNode();
  img.removeAttribute("class");
  row.append(img);
}
box.append(row);
document.body.append(box);
const big = [...row.children];

function centre(img, behavior = "smooth") {
  row.scrollTo({ left: img.offsetLeft + img.offsetWidth / 2 - row.clientWidth / 2, behavior });
}

photos.forEach((p, i) => p.addEventListener("click", () => {
  box.showModal();
  centre(big[i], "instant");
}));

// the photo nearest the middle of the window
function current() {
  const mid = row.scrollLeft + row.clientWidth / 2;
  return big.reduce((a, b) =>
    Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid) < Math.abs(a.offsetLeft + a.offsetWidth / 2 - mid) ? b : a);
}

box.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  e.preventDefault();
  const i = big.indexOf(current()) + (e.key === "ArrowRight" ? 1 : -1);
  if (big[i]) centre(big[i]);
});

// Mouse drag moves the row. A press that barely moves is still a click.
let pull = null;
row.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  pull = { id: e.pointerId, x: e.clientX, left: row.scrollLeft, moved: false };
});
row.addEventListener("pointermove", (e) => {
  if (!pull || e.pointerId !== pull.id) return;
  const dx = e.clientX - pull.x;
  if (!pull.moved) {
    if (Math.abs(dx) < 5) return;
    pull.moved = true;
    try { row.setPointerCapture(e.pointerId); } catch {}
    row.classList.add("dragging");
  }
  row.scrollLeft = pull.left - dx;
});
const endPull = (e) => {
  if (!pull || e.pointerId !== pull.id) return;
  row.classList.remove("dragging");
  setTimeout(() => { pull = null; }, 0); // keep it for the click that follows
};
row.addEventListener("pointerup", endPull);
row.addEventListener("pointercancel", endPull);
box.addEventListener("dragstart", (e) => e.preventDefault()); // no native image drag

// The top-right corner of each photo is a close button: a square a fifth of
// the photo's shorter side (at least 44px), shown by an × cursor.
function inCorner(img, e) {
  const r = img.getBoundingClientRect();
  const size = Math.max(44, Math.min(r.width, r.height) / 5);
  return e.clientX >= r.right - size && e.clientY <= r.top + size;
}
row.addEventListener("pointermove", (e) => {
  for (const img of big) img.classList.toggle("closer", img === e.target && !pull?.moved && inCorner(img, e));
});
row.addEventListener("pointerleave", () => big.forEach((img) => img.classList.remove("closer")));

box.addEventListener("click", (e) => {
  if (pull?.moved) return; // the click that ends a drag
  if (e.target.parentElement === row && !inCorner(e.target, e)) centre(e.target);
  else box.close(); // the background, or a photo's close corner
});

// A mouse wheel scrolls the row sideways (a trackpad already does), and never
// reaches the gallery behind (hscroll.js)
box.addEventListener("wheel", (e) => {
  e.stopPropagation();
  if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  row.scrollLeft += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
}, { passive: false });
