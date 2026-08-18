(() => {
  'use strict';

  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const text = (element) => (element?.textContent || '').trim();
  const findByText = (selector, needle, root = document) => {
    const candidates = all(selector, root).filter((element) => text(element).includes(needle));
    return candidates.find((element) => text(element) === needle) ||
      candidates.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length)[0];
  };
  const format = (value) => Math.round(value).toLocaleString('en-GB');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function findSection(needle) {
    const marker = findByText('h1,h2,h3', needle);
    return marker?.closest('section,header') ||
      all('section,header').find((element) => text(element).includes(needle)) || null;
  }

  function initHeroCalculator() {
    const slider = all('input[type="range"]').find(
      (element) => String(element.min) === '2' && String(element.max) === '20',
    );
    if (!slider || slider.dataset.ocHomepageBound) return;
    slider.dataset.ocHomepageBound = '1';

    const hero = slider.closest('header#top') || slider.closest('header') || document;
    const proof = hero.querySelector('.oc-proof-card');
    const hoursLabel = hero.querySelector('.oc-hours-control-heading > span:last-child');
    const hoursNumber = hoursLabel?.firstElementChild || null;
    const byHandRow = proof?.firstElementChild;
    const byHandLabel = byHandRow && text(byHandRow.firstElementChild) === 'By hand'
      ? byHandRow.lastElementChild
      : null;
    const byHandNumber = byHandLabel?.firstElementChild || null;
    const stats = proof?.querySelector('.oc-proof-stats');
    const statValues = stats ? all('.oc-proof-stat-value', stats) : [];
    const handBar = byHandRow?.nextElementSibling || null;

    let displayed = {
      year: Number((statValues[0]?.textContent || '416').replace(/,/g, '')) || 416,
      weeks: Number((statValues[1]?.textContent || '11.1').replace(/,/g, '')) || 11.1,
      cost: Number((statValues[2]?.textContent || '12480').replace(/[^0-9.]/g, '')) || 12480,
    };
    let tweenFrame = 0;
    let demoFrame = 0;
    let demoTimer = 0;
    let demoCancelled = reduceMotion;
    let lastRoundedHours = null;

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
      if (roundedHours !== lastRoundedHours) {
        if (hoursNumber) hoursNumber.textContent = String(roundedHours);
        else if (hoursLabel) hoursLabel.textContent = `${roundedHours} HRS`;
        if (byHandNumber) byHandNumber.textContent = String(roundedHours);
        else if (byHandLabel) byHandLabel.firstChild.textContent = String(roundedHours);
        lastRoundedHours = roundedHours;
      }
      setBarColour(hours);

      const target = {
        year: hours * 52,
        weeks: (hours * 52) / 37.5,
        cost: hours * 52 * 30,
      };
      cancelAnimationFrame(tweenFrame);
      const step = () => {
        const factor = animate && !reduceMotion ? 0.2 : 1;
        displayed.year += (target.year - displayed.year) * factor;
        displayed.weeks += (target.weeks - displayed.weeks) * factor;
        displayed.cost += (target.cost - displayed.cost) * factor;
        if (statValues[0]) statValues[0].textContent = format(displayed.year);
        if (statValues[1]) {
          statValues[1].textContent =
            (Math.round(displayed.weeks * 10) / 10).toLocaleString('en-GB');
        }
        if (statValues[2]) statValues[2].textContent = `£${format(displayed.cost)}`;
        if (Math.abs(target.year - displayed.year) > 0.5 || Math.abs(target.cost - displayed.cost) > 1) {
          tweenFrame = requestAnimationFrame(step);
        } else {
          displayed = target;
          if (statValues[0]) statValues[0].textContent = format(target.year);
          if (statValues[1]) {
            statValues[1].textContent =
              (Math.round(target.weeks * 10) / 10).toLocaleString('en-GB');
          }
          if (statValues[2]) statValues[2].textContent = `£${format(target.cost)}`;
        }
      };
      step();
    }

    const cancelDemo = () => {
      demoCancelled = true;
      window.clearTimeout(demoTimer);
      cancelAnimationFrame(demoFrame);
    };
    slider.addEventListener('pointerdown', cancelDemo, { once: true });
    slider.addEventListener('touchstart', cancelDemo, { once: true, passive: true });
    slider.addEventListener('keydown', cancelDemo, { once: true });
    slider.addEventListener('input', (event) => {
      if (event.isTrusted) cancelDemo();
      render(Number(slider.value), true);
    });

    const easeInOutSine = (progress) => -(Math.cos(Math.PI * progress) - 1) / 2;
    const animateHours = (from, to, duration, done) => {
      const started = performance.now();
      const tick = (now) => {
        if (demoCancelled) return;
        if (document.hidden) {
          demoCancelled = true;
          slider.value = '8';
          render(8, false);
          return;
        }
        const progress = Math.min(1, (now - started) / duration);
        const value = from + (to - from) * easeInOutSine(progress);
        slider.value = value.toFixed(3);
        render(value, false);
        if (progress < 1) demoFrame = requestAnimationFrame(tick);
        else if (done) done();
      };
      demoFrame = requestAnimationFrame(tick);
    };
    const pauseThen = (delay, action) => {
      demoTimer = window.setTimeout(() => {
        if (!demoCancelled) action();
      }, delay);
    };

    slider.value = '8';
    render(8, false);

    if (!reduceMotion) {
      pauseThen(500, () => {
        animateHours(8, 5, 1400, () => {
          pauseThen(180, () => {
            animateHours(5, 16, 2800, () => {
              pauseThen(180, () => {
                animateHours(16, 8, 1900, () => {
                  slider.value = '8';
                  render(8, false);
                });
              });
            });
          });
        });
      });
    }
  }

  function initSwitchPipeline() {
    const section = findSection('Watch one order');
    if (!section || section.dataset.ocHomepageBound) return;
    section.dataset.ocHomepageBound = '1';

    const scrubber = all('input[type="range"]', section).find(
      (element) => String(element.min) === '0' && String(element.max) === '100',
    );
    const button = section.querySelector('button');
    if (!scrubber || !button) return;

    const labels = ['Read PDF', 'Match SKUs', 'Invoice', 'Sync stock', 'Report'];
    const nodes = labels.map((label) => {
      const labelElement = findByText('div,span', label, section);
      return { labelElement, dot: labelElement?.parentElement?.firstElementChild || null };
    });
    const clock = all('div', section).find((element) =>
      /^(\d+h \d+m|\d+m|\d+s|2 min)$/.test(text(element)) &&
      parseFloat(getComputedStyle(element).fontSize) > 40);
    const doneLabel = all('div', section).find((element) =>
      /^\d\s*\/\s*5 steps done$/.test(text(element)));
    const lines = all('div', section).filter((element) => {
      const style = element.getAttribute('style') || '';
      return style.includes('top: 55px') && style.includes('height: 3px');
    });
    const progress = lines.find((element) =>
      getComputedStyle(element).backgroundColor.includes('143, 224, 175')) || lines[1];
    const thresholds = [8, 28, 48, 68, 88];
    let value = Number(scrubber.value) || 0;
    let animationFrame = 0;
    let playing = false;
    let visible = false;

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
        if (node.labelElement) node.labelElement.style.color = done ? '#eee6d5' : '#7f978a';
      });
      button.textContent = playing ? '❚❚' : '▶';
    }

    function stop() {
      playing = false;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      render(value);
    }

    function play() {
      stop();
      if (reduceMotion || !visible || document.hidden) return;
      if (value >= 100) value = 0;
      playing = true;
      const startValue = value;
      const startTime = performance.now();
      const duration = Math.max(250, (100 - startValue) * 35);
      const tick = (now) => {
        if (!playing || !visible || document.hidden) {
          stop();
          return;
        }
        const progressValue = Math.min(1, (now - startTime) / duration);
        render(startValue + (100 - startValue) * progressValue);
        if (progressValue < 1) animationFrame = requestAnimationFrame(tick);
        else stop();
      };
      render(value);
      animationFrame = requestAnimationFrame(tick);
    }

    scrubber.addEventListener('input', () => {
      stop();
      render(Number(scrubber.value));
    });
    button.addEventListener('click', () => {
      if (playing) stop();
      else play();
    });
    render(value);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting;
        if (visible && !section.dataset.ocPlayed) {
          section.dataset.ocPlayed = '1';
          value = 0;
          play();
        } else if (!visible) {
          stop();
          delete section.dataset.ocPlayed;
        }
      });
    }, { threshold: 0.3 });
    observer.observe(section);
  }

  function initScrollProgress() {
    const bar = document.querySelector(
      'body > div > div[style*="position: fixed"][style*="height: 4px"] > div',
    ) || document.querySelector('div[style*="position: fixed"][style*="height: 4px"] > div');
    if (!bar || bar.dataset.ocHomepageBound) return;
    bar.dataset.ocHomepageBound = '1';
    bar.style.width = '100%';
    bar.style.transform = 'scaleX(0)';
    bar.style.transformOrigin = '0 50%';
    bar.style.transition = 'none';

    let queued = false;
    const update = () => {
      queued = false;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const percentage = max > 0 ? (window.scrollY || root.scrollTop) / max : 0;
      bar.style.transform = `scaleX(${Math.max(0, Math.min(1, percentage))})`;
    };
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  function initAnimationVisibility() {
    const regions = all('header#top, section');
    if (!regions.length || !('IntersectionObserver' in window)) return;
    regions.forEach((region) => region.classList.add('oc-animation-paused'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('oc-animation-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '180px 0px', threshold: 0.01 });
    regions.forEach((region) => observer.observe(region));
  }

  function initPageVisibility() {
    const update = () => {
      document.documentElement.classList.toggle('oc-page-hidden', document.hidden);
    };
    document.addEventListener('visibilitychange', update, { passive: true });
    update();
  }

  function boot() {
    initHeroCalculator();
    initSwitchPipeline();
    initScrollProgress();
    initAnimationVisibility();
    initPageVisibility();
    document.documentElement.dataset.ocHomepage = 'ready';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
