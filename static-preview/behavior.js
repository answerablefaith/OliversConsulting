(() => {
  'use strict';

  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const text = (el) => (el?.textContent || '').trim();
  const findByText = (selector, needle, root = document) =>
    all(selector, root).find((el) => text(el).includes(needle));
  const format = (value) => Math.round(value).toLocaleString('en-GB');

  function findSection(needle) {
    const marker = findByText('h1,h2,h3,div,p', needle);
    return marker?.closest('section,header') || null;
  }

  function initHeroCalculator() {
    const slider = all('input[type="range"]').find(
      (el) => String(el.min) === '2' && String(el.max) === '20',
    );
    if (!slider || slider.dataset.ocStaticBound) return;
    slider.dataset.ocStaticBound = '1';

    const hero = slider.closest('header#top') || slider.closest('header') || document;
    const proof = all('div', hero).find((el) => {
      const value = text(el);
      return value.includes('By hand') && value.includes('Automated') && value.includes('hours a year');
    });
    const hoursLabel = all('span,div', hero).find(
      (el) => /\bHRS\b/.test(text(el)) && !text(el).includes('By hand'),
    );
    const byHandLabel = proof
      ? all('span,div', proof).find((el) => /hrs$/i.test(text(el)) && /^\d/.test(text(el)))
      : null;
    const stats = proof
      ? all('div', proof).find((el) => el.children.length === 3 && text(el).includes('working weeks'))
      : null;
    const statValues = stats ? Array.from(stats.children).map((item) => item.firstElementChild) : [];
    const handBar = proof
      ? all('div', proof).find((el) => {
          const style = el.getAttribute('style') || '';
          return style.includes('height: 26px') && !style.includes('position: relative');
        })
      : null;

    let displayed = {
      year: Number((statValues[0]?.textContent || '416').replace(/,/g, '')) || 416,
      weeks: Number((statValues[1]?.textContent || '11.1').replace(/,/g, '')) || 11.1,
      cost: Number((statValues[2]?.textContent || '12480').replace(/[^0-9.]/g, '')) || 12480,
    };
    let tweenFrame = 0;
    let introCancelled = false;

    const colourStops = [
      [2, [52, 132, 85]], [3, [104, 161, 72]], [6, [219, 177, 62]],
      [8, [181, 121, 31]], [9, [189, 99, 41]], [10, [197, 70, 47]],
      [11, [169, 40, 36]], [20, [130, 28, 24]],
    ];
    const mix = (a, b, amount) => a.map((value, index) =>
      Math.round(value + (b[index] - value) * amount));
    const colourFor = (hours) => {
      for (let index = 0; index < colourStops.length - 1; index += 1) {
        const [startHour, startColour] = colourStops[index];
        const [endHour, endColour] = colourStops[index + 1];
        if (hours <= endHour) {
          let amount = (hours - startHour) / (endHour - startHour);
          amount = amount * amount * (3 - 2 * amount);
          return mix(startColour, endColour, amount);
        }
      }
      return colourStops[colourStops.length - 1][1];
    };

    function setBarColour(hours) {
      if (!handBar) return;
      const centre = colourFor(hours);
      const left = mix(centre, [242, 199, 90], 0.28);
      const right = mix(centre, [72, 31, 22], 0.24);
      handBar.style.setProperty(
        'background',
        `linear-gradient(90deg,rgb(${left}),rgb(${centre}) 54%,rgb(${right}))`,
        'important',
      );
    }

    function render(hours, animate = true) {
      const roundedHours = Math.round(hours);
      const fill = ((hours - 2) / 18) * 100;
      slider.style.background = `linear-gradient(90deg,#c07c1f ${fill}%,#d6cdba ${fill}%)`;
      if (hoursLabel) hoursLabel.textContent = `${roundedHours} HRS`;
      if (byHandLabel) {
        byHandLabel.innerHTML = `${roundedHours}<span style="font-size:22px;margin-left:4px">hrs</span>`;
      }
      setBarColour(hours);

      const target = {
        year: hours * 52,
        weeks: (hours * 52) / 37.5,
        cost: hours * 52 * 30,
      };
      cancelAnimationFrame(tweenFrame);
      const step = () => {
        const factor = animate ? 0.2 : 1;
        displayed.year += (target.year - displayed.year) * factor;
        displayed.weeks += (target.weeks - displayed.weeks) * factor;
        displayed.cost += (target.cost - displayed.cost) * factor;
        if (statValues[0]) statValues[0].textContent = format(displayed.year);
        if (statValues[1]) {
          statValues[1].textContent = (Math.round(displayed.weeks * 10) / 10).toLocaleString('en-GB');
        }
        if (statValues[2]) statValues[2].textContent = `£${format(displayed.cost)}`;
        if (Math.abs(target.year - displayed.year) > 0.5 || Math.abs(target.cost - displayed.cost) > 1) {
          tweenFrame = requestAnimationFrame(step);
        } else {
          displayed = target;
          if (statValues[0]) statValues[0].textContent = format(target.year);
          if (statValues[1]) {
            statValues[1].textContent = (Math.round(target.weeks * 10) / 10).toLocaleString('en-GB');
          }
          if (statValues[2]) statValues[2].textContent = `£${format(target.cost)}`;
        }
      };
      step();
    }

    const cancelIntro = () => { introCancelled = true; };
    slider.addEventListener('pointerdown', cancelIntro, { once: true });
    slider.addEventListener('touchstart', cancelIntro, { once: true, passive: true });
    slider.addEventListener('keydown', cancelIntro, { once: true });
    slider.addEventListener('input', (event) => {
      if (event.isTrusted) introCancelled = true;
      render(Number(slider.value), true);
    });

    slider.value = '8';
    render(8, false);

    // Exact current-homepage intro sequence: 8 → 5 → 16 → 8.
    [[5, 700], [16, 1450], [8, 2300]].forEach(([value, delay]) => {
      window.setTimeout(() => {
        if (introCancelled) return;
        slider.value = String(value);
        render(value, true);
      }, delay);
    });
  }

  function initSwitchPipeline() {
    const section = findSection('Watch one order');
    if (!section || section.dataset.ocStaticBound) return;
    section.dataset.ocStaticBound = '1';

    const scrubber = all('input[type="range"]', section).find(
      (el) => String(el.min) === '0' && String(el.max) === '100',
    );
    const button = section.querySelector('button');
    if (!scrubber || !button) return;

    const labels = ['Read PDF', 'Match SKUs', 'Invoice', 'Sync stock', 'Report'];
    const nodes = labels.map((label) => {
      const labelEl = findByText('div,span', label, section);
      const parent = labelEl?.parentElement;
      return { labelEl, dot: parent?.firstElementChild || null };
    });
    const clock = all('div', section).find((el) =>
      /^(\d+h \d+m|\d+m|\d+s|2 min)$/.test(text(el)) &&
      parseFloat(getComputedStyle(el).fontSize) > 40);
    const doneLabel = all('div', section).find((el) => /\d\s*\/\s*5 steps done/.test(text(el)));
    const lines = all('div', section).filter((el) => {
      const style = el.getAttribute('style') || '';
      return style.includes('top: 55px') && style.includes('height: 3px');
    });
    const progress = lines.find((el) =>
      getComputedStyle(el).backgroundColor.includes('143, 224, 175')) || lines[1];
    const thresholds = [8, 28, 48, 68, 88];
    let value = Number(scrubber.value) || 0;
    let timer = 0;
    let playing = false;

    const displayTime = (current) => {
      const remaining = 220 - 218 * (current / 100);
      if (current >= 100) return '2 min';
      if (remaining >= 60) return `${Math.floor(remaining / 60)}h ${Math.round(remaining % 60)}m`;
      if (remaining >= 1.5) return `${Math.round(remaining)}m`;
      return `${Math.max(2, Math.round(remaining * 60))}s`;
    };

    function render(current) {
      value = Math.max(0, Math.min(100, current));
      scrubber.value = String(Math.round(value));
      scrubber.style.background =
        `linear-gradient(90deg,#d9a86a ${value}%,rgba(255,255,255,.18) ${value}%)`;
      if (progress) progress.style.width = `${value}vw`;
      if (clock) {
        clock.textContent = displayTime(value);
        clock.style.color = value >= 100 ? '#8fe0af' : value === 0 ? '#d9a86a' : '#eee6d5';
      }
      const count = thresholds.filter((threshold) => value >= threshold).length;
      if (doneLabel) doneLabel.textContent = `${count} / 5 steps done`;
      nodes.forEach((node, index) => {
        const done = value >= thresholds[index];
        if (node.dot) {
          node.dot.textContent = done ? '✓' : String(index + 1);
          Object.assign(node.dot.style, {
            background: done ? '#8fe0af' : '#1e3b2f',
            color: done ? '#123024' : '#6f8b7c',
            border: done ? '2px solid #8fe0af' : '2px solid rgba(255,255,255,.28)',
            boxShadow: done ? '0 0 0 6px rgba(143,224,175,.16)' : 'none',
          });
        }
        if (node.labelEl) node.labelEl.style.color = done ? '#eee6d5' : '#7f978a';
      });
      button.textContent = playing ? '❚❚' : '▶';
    }

    function stop() {
      playing = false;
      clearInterval(timer);
      render(value);
    }

    function play(step = 1.2, interval = 42) {
      clearInterval(timer);
      if (value >= 100) value = 0;
      playing = true;
      render(value);
      timer = window.setInterval(() => {
        if (value >= 100) {
          stop();
          return;
        }
        render(Math.min(100, value + step));
      }, interval);
    }

    scrubber.addEventListener('input', () => {
      stop();
      render(Number(scrubber.value));
    });
    button.addEventListener('click', () => {
      if (playing) stop();
      else play(1.4, 40);
    });
    render(value);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !section.dataset.ocPlayed) {
          section.dataset.ocPlayed = '1';
          value = 0;
          play();
        }
        if (!entry.isIntersecting) delete section.dataset.ocPlayed;
      });
    }, { threshold: 0.45 });
    observer.observe(section);
  }

  function initScrollProgress() {
    const bar = document.querySelector(
      'body > div > div[style*="position: fixed"][style*="height: 4px"] > div',
    ) || document.querySelector('div[style*="position: fixed"][style*="height: 4px"] > div');
    if (!bar || bar.dataset.ocStaticBound) return;
    bar.dataset.ocStaticBound = '1';

    let queued = false;
    const update = () => {
      queued = false;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      bar.style.width = `${max > 0 ? ((window.scrollY || root.scrollTop) / max) * 100 : 0}%`;
    };
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function boot() {
    initHeroCalculator();
    initSwitchPipeline();
    initScrollProgress();
    document.documentElement.dataset.ocStaticBehaviour = 'ready';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();