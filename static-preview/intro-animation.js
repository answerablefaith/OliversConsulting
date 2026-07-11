(() => {
  'use strict';

  const findSlider = () => Array.from(document.querySelectorAll('input[type="range"]')).find(
    (input) => String(input.min) === '2' && String(input.max) === '20',
  );

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function run() {
    const input = findSlider();
    if (!input || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Cancel every captured/static starter. This synthetic event does not move the slider.
    input.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    let cancelled = false;
    let frame = 0;
    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    input.addEventListener('pointerdown', cancel, { once: true });
    input.addEventListener('touchstart', cancel, { once: true, passive: true });
    input.addEventListener('keydown', cancel, { once: true });

    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    const setValue = (value, final = false) => {
      const next = final ? String(value) : Number(value).toFixed(3);
      if (descriptor?.set) descriptor.set.call(input, next);
      else input.value = next;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      if (final) input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const section = input.closest('header') || input.closest('section') || input.parentElement;
    const start = () => {
      if (cancelled) return;
      setValue(2);
      const began = performance.now();
      const duration = 2400;
      const tick = (now) => {
        if (cancelled) return;
        const t = Math.min(1, (now - began) / duration);
        setValue(2 + 6 * ease(t), t >= 1);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window && section) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.25)) return;
        observer.disconnect();
        window.setTimeout(start, 300);
      }, { threshold: [0.25, 0.5] });
      observer.observe(section);
    } else {
      window.setTimeout(start, 800);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
