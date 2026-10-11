// Project page: How far can we go with ImageNet for Text-to-Image generation?
// Loaded only on /projects/t2i-imagenet/ (via page.extra_js), after fl-common.js and t2i-data.js.
(function () {
  'use strict';

  var FL = window.FL;
  if (!FL) return;
  var root = FL.root, reduceMotion = FL.reduceMotion;
  var $ = FL.$, $$ = FL.$$, css = FL.css, onVisible = FL.onVisible;
  var el = FL.el, lineChart = FL.lineChart, addText = FL.addText, registerChart = FL.registerChart;
  var IMG = root.getAttribute('data-img-root');
  var DATA = window.T2I_DATA || {};

  function colors() {
    return { ta: css('--t2i-ta'), ia: css('--t2i-ia'), ours: css('--t2i-ours'), other: css('--t2i-other'),
      ink: css('--text-primary'), muted: css('--text-secondary') };
  }

  /* ---------------- Bubble charts: score vs. training set size ---------------- */
  var UNDISCLOSED = [1.5e11, 5e11]; // x positions of the "undisclosed data" column
  // Label side per model (r: right, l: left, t: top), chosen so labels don't collide.
  var LABEL_SIDE = {
    'chart-bubble-geneval': { 'Ours (1B)': 'r', 'PixArt-α': 'r', 'PixArt-Σ': 'r', 'SD v1.5': 'l', 'SD v2.1': 'l', 'SDXL': 'l', 'SD3 M': 'l', 'SANA-0.6': 'l', 'FLUX-dev': 't' },
    'chart-bubble-dpg': { 'Ours (1B)': 'r', 'PixArt-α': 'r', 'PixArt-Σ': 'r', 'SD v1.5': 'l', 'SDXL': 'l', 'SD3 M': 'l', 'SANA-0.6': 'l', 'FLUX-dev': 't' }
  };
  function bubbleChart(id, rows, y) {
    registerChart(id, function (c, instant) {
      var C = colors(), undiscl = 0;
      var fmt = { 1e6: '1M', 1e7: '10M', 1e8: '100M', 1e9: '1B', 1e10: '10B' };
      lineChart(c, {
        h: 340, ratio: 0.85,
        x: { min: 5e5, max: 1e12, log: true, ticks: [1e6, 1e7, 1e8, 1e9, 1e10], fmt: function (t) { return fmt[t]; }, label: 'Training images (log scale)' },
        y: y,
        series: [],
        before: function (g, X, Y) {
          el('line', { x1: X(4e10), x2: X(4e10), y1: Y(y.min), y2: Y(y.max), stroke: C.muted, 'stroke-dasharray': '3 4' }, g);
        },
        after: function (svg, X, Y) {
          addText(svg, X(2.7e11), Y(y.min) + 18, 'undisclosed', { 'text-anchor': 'middle' });
          rows.forEach(function (r) {
            var ours = r[4] === 'ours';
            var xv = r[1] == null ? UNDISCLOSED[undiscl++] : r[1];
            var cx = X(xv), cy = Y(r[3]), rad = 3 + 6 * Math.sqrt(r[2]);
            var col = ours ? C.ours : C.other;
            el('circle', { cx: cx, cy: cy, r: rad, fill: col, 'fill-opacity': ours ? 0.55 : 0.28, stroke: col, 'stroke-width': ours ? 2.5 : 1.5 }, svg);
            var side = (LABEL_SIDE[id] || {})[r[0]] || 't', cls = 't2i-blabel fade' + (ours ? ' is-ours' : '');
            if (side === 't') addText(svg, cx, cy - rad - 5, r[0], { 'text-anchor': 'middle', class: cls });
            else addText(svg, side === 'r' ? cx + rad + 5 : cx - rad - 5, cy + 4, r[0], { 'text-anchor': side === 'r' ? 'start' : 'end', class: cls });
          });
        }
      }).draw(true);
    });
  }
  if (DATA.geneval) bubbleChart('chart-bubble-geneval', DATA.geneval, { min: 0.38, max: 0.74, ticks: [0.4, 0.5, 0.6, 0.7], fmt: function (t) { return t.toFixed(1); }, label: 'GenEval overall ↑' });
  if (DATA.dpg) bubbleChart('chart-bubble-dpg', DATA.dpg, { min: 58, max: 90, ticks: [60, 70, 80, 90], label: 'DPGBench overall ↑' });

  /* ---------------- Caption explorer ---------------- */
  (function () {
    var card = $('.t2i-captions'); if (!card || !DATA.captions) return;
    var tabs = $('.t2i-cap-tabs', card), imgEl = $('.t2i-cap-img', card), text = $('.t2i-typed', card), aio = $('.t2i-cap-aio', card);
    tabs.innerHTML = DATA.captions.map(function (c, i) { return '<button class="fl-chip" data-i="' + i + '">' + c.setting + '</button>'; }).join('');
    DATA.captions.forEach(function (c) { new Image().src = IMG + '/captions/' + c.img + '.jpg'; });
    function show(i) {
      var c = DATA.captions[i];
      $$('.fl-chip', tabs).forEach(function (b, j) { b.classList.toggle('is-active', j === i); });
      imgEl.src = IMG + '/captions/' + c.img + '.jpg';
      aio.style.visibility = i === 0 ? 'visible' : 'hidden'; // AIO only applies to the original ImageNet image
      text.textContent = c.caption;
    }
    $$('.fl-chip', tabs).forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-i')); }); });
    show(0);
  })();

  /* ---------------- Overfitting: GenEval vs. training steps ---------------- */
  (function () {
    if (!DATA.overfit) return;
    var cfg = {
      'TextRIN-I': { x: { min: 90, max: 510, ticks: [100, 200, 300, 400, 500] }, y: { min: 0.46, max: 0.58, ticks: [0.48, 0.52, 0.56] } },
      'SiT-I': { x: { min: 20, max: 310, ticks: [50, 100, 150, 200, 250, 300] }, y: { min: 0.36, max: 0.64, ticks: [0.4, 0.5, 0.6] } },
      'JiT-I': { x: { min: 20, max: 410, ticks: [100, 200, 300, 400] }, y: { min: 0.2, max: 0.58, ticks: [0.2, 0.3, 0.4, 0.5] } }
    };
    Object.keys(cfg).forEach(function (name, i) {
      registerChart('chart-overfit-' + i, function (c, instant) {
        var C = colors(), d = DATA.overfit[name], k = cfg[name];
        lineChart(c, {
          h: 280, ratio: 0.9,
          x: Object.assign({ label: 'Training steps (k)' }, k.x),
          y: Object.assign({ label: 'GenEval ↑', fmt: function (t) { return t.toFixed(2); } }, k.y),
          series: [{ pts: d.ta, color: C.ta, dots: true, width: 2.5 }, { pts: d.ia, color: C.ia, dots: true, width: 2.5 }]
        }).draw(true);
      });
    });
  })();

  /* ---------------- MIRO training progression ---------------- */
  // As in the paper: all steps are shown; columns appear left to right and stay.
  (function () {
    var card = $('.t2i-miro'); if (!card || reduceMotion) return;
    var replay = $('.t2i-miro-replay', card);
    card.classList.add('is-armed'); // hide cells until played (only when JS runs)
    function play() {
      card.classList.remove('is-on');
      card.getBoundingClientRect();
      card.classList.add('is-on');
    }
    replay.addEventListener('click', play);
    onVisible(card, play, 0.3);
  })();
})();
