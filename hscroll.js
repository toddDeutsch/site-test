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
