// Horizontal layout: the home page cards and the gallery rows loop. Two
// copies of the whole set sit on each side of the real items, and whenever
// the row comes to rest more than half a set away from the real items it
// jumps back by one set (to an identical view), so scrolling, dragging or
// clicking on keeps going round in either direction. Loaded before edges.js,
// grid.js and lightbox.js so they see the copies. styles.css shows the
// copies (class "copy") only in the horizontal layout.
{
  const strip = document.querySelector("body.h-layout > main.projects, body.h-layout > main.gallery");
  const sideways = matchMedia("(min-width: 900px) and (orientation: landscape)");
  const onHome = strip?.classList.contains("projects");
  const items = strip ? [...strip.children].filter((c) => !c.hidden) : [];
  const COPIES = 2; // sets each side: enough for a long fling or drag

  if (items.length > 1) {
    strip.classList.add("loops");
    const copy = () => items.map((c) => {
      const k = c.cloneNode(true);
      k.removeAttribute("id");
      k.classList.add("copy");
      k.setAttribute("aria-hidden", "true");
      k.setAttribute("tabindex", "-1");
      return k;
    });
    for (let i = 0; i < COPIES; i++) {
      strip.prepend(...copy());
      strip.append(...copy());
    }

    // width of one whole set, and the scroll position that centres an item
    const setWidth = () => items[0].offsetLeft - strip.children[items.length * (COPIES - 1)].offsetLeft;
    const centreOf = (c) => c.offsetLeft + c.offsetWidth / 2 - strip.clientWidth / 2;

    // jump back by whole sets when the row has drifted too far from the real items
    function wrap() {
      if (!sideways.matches || strip.classList.contains("dragging")) return;
      const set = setWidth();
      const middle = (centreOf(items[0]) + centreOf(items.at(-1))) / 2; // of the real set
      const off = strip.scrollLeft - middle;
      if (Math.abs(off) <= set / 2) return;
      strip.scrollLeft -= Math.round(off / set) * set;
    }

    // start where the page used to: home with the first card centred, a
    // gallery with its first photo at the usual gap from the left edge
    const start = () => {
      if (!sideways.matches) return;
      strip.scrollLeft = onHome ? centreOf(items[0])
        : items[0].offsetLeft - parseFloat(getComputedStyle(strip).paddingLeft);
    };
    start();
    sideways.addEventListener("change", start);

    // wait until the row is still, so smooth scrolls and drags aren't cut short
    let rest;
    const later = () => { clearTimeout(rest); rest = setTimeout(wrap, 150); };
    strip.addEventListener("scroll", later);
    strip.addEventListener("pointerup", later);

    // keep the same item centred when the window changes size
    let nearest = items[0];
    strip.addEventListener("scroll", () => {
      const mid = strip.scrollLeft + strip.clientWidth / 2;
      nearest = [...strip.children].reduce((a, b) =>
        Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid) < Math.abs(a.offsetLeft + a.offsetWidth / 2 - mid) ? b : a);
    });
    addEventListener("resize", () => {
      if (sideways.matches) strip.scrollLeft = centreOf(nearest);
    });
  }
}
