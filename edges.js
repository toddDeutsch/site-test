// Horizontal layout: clicks that move the row back or forward, shown by arrow
// cursors (only when there is further to go that way).
// - Home page and galleries: clicking anywhere right of the main item's middle part
//   (its right third, the gap, or the next card or photo peeking in)
//   centres the next item; anywhere left of it, the previous one. The main
//   item is the home page card, statement card or photo nearest the middle of
//   the window. Home page cards and the statement card use their outer 15%
//   instead of thirds; the rest of a home card opens the project as usual.
// - Driftless grid page: the far left or right of the window moves the grid
//   one window width.
// - Galleries and the grid page: the band above the photos, across the right
//   15% of the window, goes back to the home page (shown by an ×).
// These clicks win over opening a card or photo, but a drag that ends there
// still just drags (hscroll.js).
{
  const strip = document.querySelector("body.h-layout > main");
  const sideways = matchMedia("(min-width: 900px) and (orientation: landscape)");
  const byWindow = strip?.classList.contains("grid");
  const onHome = strip?.classList.contains("projects");
  const EDGE = (w) => Math.max(48, w * 0.08); // width of each window edge zone
  const items = !strip || byWindow ? []
    : strip.classList.contains("projects") ? [...strip.querySelectorAll(".project")].filter((c) => !c.hidden)
    : [...strip.querySelectorAll(":scope > .plate")]; // statement card and photos
  let downX = null;

  // the item nearest the middle of the window
  function mainItem() {
    const mid = strip.getBoundingClientRect().left + strip.clientWidth / 2;
    const off = (c) => { const r = c.getBoundingClientRect(); return Math.abs(r.left + r.width / 2 - mid); };
    return items.reduce((a, b) => (off(b) < off(a) ? b : a));
  }
  // the item to move to (or null): the next one for a click right of the main
  // item's middle third, the previous one for a click left of it
  function itemTarget(e) {
    const main = mainItem();
    const r = main.getBoundingClientRect();
    const edge = main.classList.contains("statement") || onHome ? 0.15 : 1 / 3; // home cards and the statement card: only their outer 15%
    const d = e.clientX > r.right - r.width * edge ? 1 : e.clientX < r.left + r.width * edge ? -1 : 0;
    return d ? items[items.indexOf(main) + d] || null : null;
  }

  // galleries: the band above the photos, across the right 15% of the window,
  // also goes back to the home page (shown by an × cursor)
  function toHomeCorner(e) {
    if (!sideways.matches || !strip.classList.contains("gallery")) return false;
    const r = strip.getBoundingClientRect();
    const top = Math.min(...[...strip.children].map((c) => c.getBoundingClientRect().top));
    return e.clientY >= r.top && e.clientY < top && e.clientX > r.right - r.width * 0.15;
  }

  // which way a click here moves the row: -1, 0 or 1
  function dir(e) {
    if (!sideways.matches || e.target.closest(".menu")) return 0;
    if (!byWindow) {
      const t = itemTarget(e);
      return t ? Math.sign(items.indexOf(t) - items.indexOf(mainItem())) : 0;
    }
    const r = strip.getBoundingClientRect();
    const w = EDGE(r.width);
    if (e.clientX > r.right - w && strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1) return 1;
    if (e.clientX < r.left + w && strip.scrollLeft > 0) return -1;
    return 0;
  }

  function centreItem(item) {
    const r = item.getBoundingClientRect();
    const mid = strip.getBoundingClientRect().left + strip.clientWidth / 2;
    strip.scrollBy({ left: r.left + r.width / 2 - mid, behavior: "smooth" });
  }

  strip?.addEventListener("pointermove", (e) => {
    const dragging = strip.classList.contains("dragging");
    const close = !dragging && toHomeCorner(e);
    const d = dragging || close ? 0 : dir(e);
    strip.classList.toggle("edge-next", d === 1);
    strip.classList.toggle("edge-prev", d === -1);
    strip.classList.toggle("edge-close", close);
  });
  const clear = () => strip.classList.remove("edge-next", "edge-prev", "edge-close");
  strip?.addEventListener("scroll", clear); // rechecked on the next move
  strip?.addEventListener("pointerleave", clear);
  strip?.addEventListener("pointerdown", (e) => { downX = e.clientX; });
  strip?.addEventListener("click", (e) => {
    if (downX !== null && Math.abs(e.clientX - downX) > 5) return; // the end of a drag
    if (toHomeCorner(e)) {
      e.preventDefault();
      e.stopPropagation();
      location.href = "index.html";
      return;
    }
    const d = dir(e);
    if (!d) return;
    e.preventDefault(); // don't follow a card's link
    e.stopPropagation(); // or open a photo
    if (byWindow) strip.scrollBy({ left: d * strip.clientWidth, behavior: "smooth" });
    else centreItem(itemTarget(e));
  }, true);
}
