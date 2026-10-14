// Menu overlay: each menu button toggles the nav inside its own bar.
document.querySelectorAll(".menu-btn").forEach((btn) => {
  const menu = document.getElementById(btn.getAttribute("aria-controls"));

  const setOpen = (open) => {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(menu.hidden);
  });

  document.addEventListener("click", (e) => {
    if (!menu.hidden && !menu.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      setOpen(false);
      btn.focus();
    }
  });
});
