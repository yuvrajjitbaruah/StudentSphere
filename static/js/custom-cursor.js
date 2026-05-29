(function () {
  const cursor = document.getElementById("customCursor");
  if (!cursor) return;

  const supportsFinePointer =
    window.matchMedia &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsFinePointer) return;

  document.body.classList.add("custom-cursor-on");

  const ring = cursor.querySelector(".cursor-ring");
  const dot = cursor.querySelector(".cursor-dot");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;
  let visible = false;

  function setVisible(v) {
    visible = v;
    cursor.classList.toggle("is-visible", v);
  }

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) setVisible(true);
  }

  function onLeave() {
    setVisible(false);
  }

  function onDown() {
    cursor.classList.add("is-down");
  }

  function onUp() {
    cursor.classList.remove("is-down");
  }

  function isInteractive(el) {
    if (!el) return false;
    return (
      el.closest(
        "a, button, .mini-btn, .btn-primary, .btn-secondary, .btn-link, input[type='checkbox'], [role='button']"
      ) !== null
    );
  }

  function onOver(e) {
    const t = e.target;
    cursor.classList.toggle("is-hover", isInteractive(t));
    // Hide custom cursor over text inputs to preserve I-beam UX.
    const isText =
      t &&
      (t.tagName === "INPUT" || t.tagName === "TEXTAREA") &&
      (t.type === "text" ||
        t.type === "email" ||
        t.type === "password" ||
        t.type === "search" ||
        t.type === "number");
    cursor.classList.toggle("is-hidden", !!isText);
  }

  document.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseleave", onLeave);
  document.addEventListener("mousedown", onDown);
  document.addEventListener("mouseup", onUp);
  document.addEventListener("mouseover", onOver, { passive: true });

  function tick() {
    // Smooth-follow
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dotX += (mouseX - dotX) * 0.55;
    dotY += (mouseY - dotY) * 0.55;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

