/* ══════════════════════════════════════════════════════════════
   Fig. 01 — the machine
   One rAF loop, transform/opacity only, cancelled the moment the
   hero leaves the viewport. Every telemetry field reports a real
   value or it does not exist.
   ══════════════════════════════════════════════════════════════ */

const MOUTH_NEUTRAL = "M104 120 L113 124 L127 124 L136 120";
const MOUTH_SMILE = "M100 115 L111 126 L129 126 L140 115";

/* Excursions. Eye units are SVG user units on a 240-wide viewBox —
   at the 220px desktop render that is ~0.92 CSS px each, so 5.5u
   lands around 5px: perceptible, still quiet. */
const EYE_MAX = 5.5;
const GLOW_MAX = 14;
const TILT_MAX = 1.5;
const SHIFT_MAX = 2;
const REACH = 320;

const IDLE_AFTER = 4000;
const BLINK_MIN = 3000;
const BLINK_MAX = 7000;
const BLINK_HOLD = 110;
const WINK_HOLD = 180;
const ACK_HOLD = 600;
const TOUCH_LOOK = 1200;

const sign = (n) => (n < 0 ? "\u2212" : "+") + Math.abs(n).toFixed(2);

export function initMachine() {
  const root = document.getElementById("machine");
  const button = document.getElementById("machineButton");
  const mouth = document.getElementById("machineMouth");
  const telPtrX = document.getElementById("telPtrX");
  const telPtrY = document.getElementById("telPtrY");
  const telState = document.getElementById("telState");
  if (!root || !button) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const target = { eye: [0, 0], glow: [0, 0], tilt: [0, 0], shift: [0, 0] };
  const vector = [0, 0];

  let frame = null;
  let dirty = false;
  let inView = true;
  let idleTimer = null;
  let blinkTimer = null;
  let holdTimer = null;
  let touchTimer = null;

  /* ── Writes ─────────────────────────────────────────────── */

  function setState(name) {
    root.dataset.state = name.toLowerCase();
    if (telState) telState.textContent = name;
  }

  function commit() {
    frame = null;
    if (!dirty) return;
    dirty = false;

    root.style.setProperty("--eye-x", `${target.eye[0]}px`);
    root.style.setProperty("--eye-y", `${target.eye[1]}px`);
    root.style.setProperty("--glow-x", `${target.glow[0]}px`);
    root.style.setProperty("--glow-y", `${target.glow[1]}px`);
    root.style.setProperty("--tilt-x", `${target.tilt[0]}deg`);
    root.style.setProperty("--tilt-y", `${target.tilt[1]}deg`);
    root.style.setProperty("--shift-x", `${target.shift[0]}px`);
    root.style.setProperty("--shift-y", `${target.shift[1]}px`);

    if (telPtrX) telPtrX.textContent = sign(vector[0]);
    if (telPtrY) telPtrY.textContent = sign(vector[1]);
  }

  function schedule() {
    dirty = true;
    if (frame === null && inView) frame = requestAnimationFrame(commit);
  }

  function rest() {
    target.eye = [0, 0];
    target.glow = [0, 0];
    target.tilt = [0, 0];
    target.shift = [0, 0];
    vector[0] = 0;
    vector[1] = 0;
    schedule();
  }

  /* ── Look ───────────────────────────────────────────────── */

  function lookAt(x, y) {
    const box = button.getBoundingClientRect();
    if (!box.width) return;

    const dx = x - (box.left + box.width / 2);
    const dy = y - (box.top + box.height / 2);
    const dist = Math.max(Math.hypot(dx, dy), 1);
    const reach = Math.min(dist / REACH, 1);
    const ux = (dx / dist) * reach;
    const uy = (dy / dist) * reach;

    vector[0] = ux;
    vector[1] = uy;

    target.eye = [ux * EYE_MAX, uy * EYE_MAX];

    /* Parallax and glow are pointer concepts. Neither survives
       reduced motion, and neither exists on touch. */
    if (!reduce.matches) {
      target.glow = [ux * GLOW_MAX, uy * GLOW_MAX];
      target.tilt = [-uy * TILT_MAX, ux * TILT_MAX];
      target.shift = [ux * SHIFT_MAX, uy * SHIFT_MAX];
    }

    if (mouth) mouth.setAttribute("d", MOUTH_NEUTRAL);
    schedule();
  }

  function goIdle() {
    rest();
    if (mouth) mouth.setAttribute("d", MOUTH_SMILE);
    setState("Idle");
  }

  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(goIdle, IDLE_AFTER);
  }

  /* ── Pointer ────────────────────────────────────────────── */

  function onPointerMove(event) {
    if (event.pointerType === "touch") return;
    lookAt(event.clientX, event.clientY);
    setState("Tracking");
    armIdle();
  }

  /* ── Blink ──────────────────────────────────────────────── */

  function armBlink() {
    clearTimeout(blinkTimer);
    if (reduce.matches) return;
    const wait = BLINK_MIN + Math.random() * (BLINK_MAX - BLINK_MIN);
    blinkTimer = setTimeout(() => {
      root.classList.add("is-blinking");
      setTimeout(() => {
        root.classList.remove("is-blinking");
        armBlink();
      }, BLINK_HOLD);
    }, wait);
  }

  /* ── Acknowledge ────────────────────────────────────────── */

  function acknowledge() {
    clearTimeout(holdTimer);
    if (mouth) mouth.setAttribute("d", MOUTH_SMILE);
    setState("Ack");

    if (reduce.matches) {
      holdTimer = setTimeout(goIdle, ACK_HOLD);
      return;
    }

    root.classList.add("is-winking");
    setTimeout(() => root.classList.remove("is-winking"), WINK_HOLD);
    holdTimer = setTimeout(goIdle, ACK_HOLD);
  }

  /* ── Touch — tap to greet, then a brief look ────────────── */

  function onTouchLook(event) {
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) return;
    lookAt(touch.clientX, touch.clientY);
    clearTimeout(touchTimer);
    touchTimer = setTimeout(rest, TOUCH_LOOK);
  }

  /* ── Wiring ─────────────────────────────────────────────── */

  function applyInputMode() {
    window.removeEventListener("pointermove", onPointerMove);
    root.classList.toggle("is-static", reduce.matches);

    if (finePointer.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    clearTimeout(idleTimer);
    armBlink();

    if (reduce.matches) {
      rest();
      if (mouth) mouth.setAttribute("d", MOUTH_SMILE);
      setState("Ready");
    }
  }

  button.addEventListener("click", acknowledge);
  button.addEventListener("touchend", onTouchLook, { passive: true });
  reduce.addEventListener("change", applyInputMode);
  finePointer.addEventListener("change", applyInputMode);

  /* The loop stops running the moment it cannot be seen. */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView && frame !== null) {
          cancelAnimationFrame(frame);
          frame = null;
        } else if (inView && dirty) {
          schedule();
        }
      },
      { rootMargin: "80px" },
    ).observe(root);
  }

  applyInputMode();

  /* Left alone, it settles into a smile — the behaviour the old site had
     and the reason people liked it. */
  if (!reduce.matches) armIdle();
}
