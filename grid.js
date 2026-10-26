// Test (driftless-grid.html only): in the sideways layout, clicking the left
// 15% of the statement card (the last thing in the set) scrolls back one
// window width to the photos, and its right 15% moves the card just out of
// view so the grid starts again (the row loops, loop.js). Arrow cursors show
// where. The row loops, so this works on every copy of the card. Dragging the
// row still works: hscroll.js swallows the click that ends a drag.
const grid = document.querySelector("main.gallery.grid");
const sideways = matchMedia("(min-width: 900px) and (orientation: landscape)");

// -1 for the card's left 15%, 1 for its right 15%, otherwise 0
function side(card, e) {
  if (!sideways.matches) return 0;
  const r = card.getBoundingClientRect();
  return e.clientX < r.left + r.width * 0.15 ? -1 : e.clientX > r.right - r.width * 0.15 ? 1 : 0;
}

for (const card of grid?.querySelectorAll(":scope > .statement") ?? []) {
  card.addEventListener("pointermove", (e) => {
    const s = grid.classList.contains("dragging") ? 0 : side(card, e);
    card.classList.toggle("to-photos", s === -1);
    card.classList.toggle("to-start", s === 1);
  });
  card.addEventListener("pointerleave", () => card.classList.remove("to-photos", "to-start"));
  card.addEventListener("click", (e) => {
    const s = side(card, e);
    if (s === -1) grid.scrollBy({ left: -grid.clientWidth, behavior: "smooth" });
    if (s === 1) {
      // the first photos then sit at the usual gap from the left edge
      const next = card.nextElementSibling;
      if (!next) return;
      const pad = parseFloat(getComputedStyle(grid).paddingLeft);
      grid.scrollBy({ left: next.getBoundingClientRect().left - grid.getBoundingClientRect().left - pad, behavior: "smooth" });
    }
  });
}
