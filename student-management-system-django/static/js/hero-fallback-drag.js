(function () {
    const fallbackWrap = document.getElementById("hero3dFallback");
    if (!fallbackWrap) return;

    const cube = fallbackWrap.querySelector(".cube");
    if (!cube) return;

    const prefersReducedMotion =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // If WebGL is active, the fallback gets hidden; don't waste animation frames.
    const isFallbackHidden = getComputedStyle(fallbackWrap).display === "none";
    if (prefersReducedMotion || isFallbackHidden) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotX = parseFloat(getComputedStyle(cube).getPropertyValue("--cube-rot-x")) || 18;
    let startRotY = parseFloat(getComputedStyle(cube).getPropertyValue("--cube-rot-y")) || -24;

    // Idle motion (subtle) when not dragging
    let rotX = startRotX;
    let rotY = startRotY;
    let idleT = 0;
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function setRotation(x, y) {
        rotX = clamp(x, -70, 70);
        rotY = clamp(y, -180, 180);
        cube.style.setProperty("--cube-rot-x", `${rotX}deg`);
        cube.style.setProperty("--cube-rot-y", `${rotY}deg`);
    }

    // pointer events
    fallbackWrap.addEventListener("pointerdown", (e) => {
        isDragging = true;
        cube.setPointerCapture?.(e.pointerId);
        startX = e.clientX;
        startY = e.clientY;
        startRotX = rotX;
        startRotY = rotY;
        idleT = 0;
    });

    fallbackWrap.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const nextY = startRotY + dx * 0.35;
        const nextX = startRotX - dy * 0.25;
        setRotation(nextX, nextY);
    });

    fallbackWrap.addEventListener("pointerup", () => {
        isDragging = false;
    });
    fallbackWrap.addEventListener("pointercancel", () => {
        isDragging = false;
    });

    function tick() {
        if (!isDragging) {
            idleT += 0.016;
            const idleX = startRotX + Math.sin(idleT * 0.9) * 6;
            const idleY = startRotY + Math.cos(idleT * 0.7) * 12;
            setRotation(idleX, idleY);
        }
        requestAnimationFrame(tick);
    }

    // Initialize variables
    setRotation(startRotX, startRotY);
    requestAnimationFrame(tick);
})();

