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
