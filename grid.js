// Test (driftless-grid.html only): in the sideways layout, clicking the right
// third of the statement card scrolls to the first column of photos (a right
// arrow cursor shows where). Dragging the row still works: hscroll.js swallows
// the click that ends a drag.
const grid = document.querySelector("main.gallery.grid");
const card = grid?.querySelector(".statement");
const sideways = matchMedia("(min-width: 900px) and (orientation: landscape)");

const inRightThird = (e) => {
  const r = card.getBoundingClientRect();
  return sideways.matches && e.clientX > r.left + (r.width * 2) / 3;
};

card?.addEventListener("pointermove", (e) => {
  card.classList.toggle("to-photos", !grid.classList.contains("dragging") && inRightThird(e));
});
card?.addEventListener("pointerleave", () => card.classList.remove("to-photos"));

card?.addEventListener("click", (e) => {
  if (!inRightThird(e)) return;
  // move the card just out of view, so the first photos sit at the usual gap from the edge
  const left = grid.scrollLeft + card.getBoundingClientRect().right - grid.getBoundingClientRect().left;
  grid.scrollTo({ left, behavior: "smooth" });
});

// Clicking near the far left or right of the window moves the grid back or
// forward one window width (arrow cursors show where; only when there is
// further to go that way). These clicks win over opening a photo, but a
// drag that ends there still just drags.
const EDGE = (w) => Math.max(48, w * 0.08); // width of each edge zone
let downX = null;

function edge(e) {
  if (!sideways.matches) return 0;
  const r = grid.getBoundingClientRect();
  const w = EDGE(r.width);
  if (e.clientX > r.right - w && grid.scrollLeft + grid.clientWidth < grid.scrollWidth - 1) return 1;
  if (e.clientX < r.left + w && grid.scrollLeft > 0) return -1;
  return 0;
}
const showEdge = (e) => {
  const d = grid.classList.contains("dragging") ? 0 : edge(e);
  grid.classList.toggle("edge-next", d === 1);
  grid.classList.toggle("edge-prev", d === -1);
};

grid?.addEventListener("pointermove", showEdge);
grid?.addEventListener("scroll", () => grid.classList.remove("edge-next", "edge-prev")); // recheck on next move
grid?.addEventListener("pointerleave", () => grid.classList.remove("edge-next", "edge-prev"));
grid?.addEventListener("pointerdown", (e) => { downX = e.clientX; });
grid?.addEventListener("click", (e) => {
  if (downX !== null && Math.abs(e.clientX - downX) > 5) return; // the end of a drag
  const d = edge(e);
  if (!d) return;
  e.preventDefault();
  e.stopPropagation(); // don't open the photo or jump from the card
  grid.scrollBy({ left: d * grid.clientWidth, behavior: "smooth" });
}, true);
