// Horizontal layout: when the row layout is active, turn vertical mouse-wheel
// movement into sideways scrolling so a regular mouse can move through <main>.
const strip = document.querySelector("body.h-layout > main");
const horizontal = matchMedia("(min-width: 900px) and (orientation: landscape)");

window.addEventListener("wheel", (e) => {
  if (!strip || !horizontal.matches || e.ctrlKey) return;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // trackpad already scrolls sideways
  const scroller = e.target.closest(".statement-text");
  if (scroller && scroller.scrollHeight > scroller.clientHeight) return; // let long text scroll
  if (e.target.closest(".menu")) return;
  e.preventDefault();
  strip.scrollLeft += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
}, { passive: false });

// Click-and-drag with a mouse also moves the row. Touch and pens scroll
// natively, so only mouse pointers are handled. A press that moves less than
// a few pixels is still an ordinary click (so the home page cards stay links).
// Statement text is draggable too (styles.css turns off selecting it here):
// sideways movement moves the row, up-and-down movement scrolls long text.
const DRAG_THRESHOLD = 5;
let drag = null;

strip?.addEventListener("pointerdown", (e) => {
  if (!horizontal.matches || e.pointerType !== "mouse" || e.button !== 0) return;
  if (e.target.closest(".menu")) return;
  const text = e.target.closest(".statement-text");
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: strip.scrollLeft,
           text, top: text?.scrollTop, moved: false };
});

strip?.addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x;
  const dy = drag.text ? e.clientY - drag.y : 0;
  if (!drag.moved) {
    if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.moved = true;
    strip.setPointerCapture(e.pointerId);
    strip.classList.add("dragging");
  }
  strip.scrollLeft = drag.left - dx;
  if (drag.text) drag.text.scrollTop = drag.top - dy;
});

const endDrag = (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  if (drag.moved) strip.classList.remove("dragging");
  // keep `drag` until the click that follows has been seen (and swallowed if moved)
  setTimeout(() => { drag = null; }, 0);
};

// a drag ends with a click; swallow it so it doesn't open a home page card
strip?.addEventListener("click", (e) => {
  if (drag?.moved) { e.preventDefault(); e.stopPropagation(); }
}, true);
strip?.addEventListener("pointerup", endDrag);
strip?.addEventListener("pointercancel", endDrag);

// stop the browser's own image/link drag-and-drop from hijacking the gesture
strip?.addEventListener("dragstart", (e) => {
  if (horizontal.matches) e.preventDefault();
});
