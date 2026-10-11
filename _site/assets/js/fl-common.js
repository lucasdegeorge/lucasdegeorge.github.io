// Shared helpers for the animated project pages (FLoSS, T2I-ImageNet):
// KaTeX rendering and a minimal animated SVG line chart.
// Exposes window.FL; page scripts (floss.js, t2i.js) build on it.
(function () {
  'use strict';

  var root = document.querySelector('.fl');
  if (!root) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function onVisible(el, cb, threshold) {
    if (!el) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); cb(); } });
    }, { threshold: threshold || 0.25 });
    io.observe(el);
  }

  /* ---------------- Math ---------------- */
  if (window.renderMathInElement) {
    renderMathInElement(root, {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false
    });
  }



  /* ---------------- Minimal SVG line charts ---------------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function scale(ax, a, b) {
    var f = ax.log ? Math.log : function (x) { return x; };
    var d0 = f(ax.min), d1 = f(ax.max);
    var s = function (v) { return a + (f(v) - d0) / (d1 - d0) * (b - a); };
    s.inv = function (px) { var t = d0 + (px - a) / (b - a) * (d1 - d0); return ax.log ? Math.exp(t) : t; };
    return s;
  }
  // cfg: {w,h, x:{min,max,log,ticks,fmt,label}, y:{...}, series:[{pts,color,width,dash,opacity,dots,name}], legend:true}
  function lineChart(container, cfg) {
    container.innerHTML = '';
    var W = Math.max(280, Math.round(container.clientWidth || 520));
    var H = Math.round(Math.max(220, Math.min(cfg.h || 300, W * (cfg.ratio || 0.68))));
    var m = { t: cfg.legend ? 34 : 16, r: 18, b: 42, l: 52 };
    // legend items wrap onto a second row when they don't fit
    var legendItems = cfg.legend ? (cfg.series || []).filter(function (s) { return s.name; }) : [];
    var legendW = function (s) { return 24 + s.name.length * 6.6 + 14; };
    if (legendItems.reduce(function (a, s) { return a + legendW(s); }, m.l) > W - m.r) m.t = 52;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img' }, container);
    if (cfg.title) svg.setAttribute('aria-label', cfg.title);
    var X = scale(cfg.x, m.l, W - m.r), Y = scale(cfg.y, H - m.b, m.t);
    var g = el('g', { class: 'grid' }, svg);
    (cfg.y.ticks || []).forEach(function (t) {
      el('line', { x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t) }, g);
      var tx = el('text', { x: m.l - 8, y: Y(t) + 4, 'text-anchor': 'end' }, svg);
      tx.textContent = cfg.y.fmt ? cfg.y.fmt(t) : t;
    });
    (cfg.x.ticks || []).forEach(function (t) {
      var tx = el('text', { x: X(t), y: H - m.b + 18, 'text-anchor': 'middle' }, svg);
      tx.textContent = cfg.x.fmt ? cfg.x.fmt(t) : t;
    });
    var ax = el('g', { class: 'ax' }, svg);
    el('line', { x1: m.l, x2: m.l, y1: m.t, y2: H - m.b }, ax);
    el('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }, ax);
    if (cfg.x.label) { var xl = el('text', { x: (m.l + W - m.r) / 2, y: H - 6, 'text-anchor': 'middle', class: 'lbl' }, svg); xl.textContent = cfg.x.label; }
    if (cfg.y.label) { var yl = el('text', { x: 14, y: (m.t + H - m.b) / 2, 'text-anchor': 'middle', class: 'lbl', transform: 'rotate(-90 14 ' + (m.t + H - m.b) / 2 + ')' }, svg); yl.textContent = cfg.y.label; }

    var clipId = 'c' + Math.random().toString(36).slice(2);
    var cp = el('clipPath', { id: clipId }, el('defs', {}, svg));
    el('rect', { x: m.l, y: m.t - 6, width: W - m.l - m.r + 6, height: H - m.t - m.b + 12 }, cp);
    var plot = el('g', { 'clip-path': 'url(#' + clipId + ')' }, svg);
    if (cfg.before) cfg.before(plot, X, Y, svg);
    var paths = (cfg.series || []).map(function (s) {
      var d = s.pts.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join('');
      var path = el('path', { d: d, class: 'ln', stroke: s.color, 'stroke-width': s.width || 3, opacity: s.opacity == null ? 1 : s.opacity }, plot);
      if (s.dash) path.setAttribute('stroke-dasharray', s.dash);
      if (s.dots) s.pts.forEach(function (p) { el('circle', { cx: X(p[0]), cy: Y(p[1]), r: 4, class: 'dot fade', stroke: s.color }, plot); });
      s._path = path;
      return path;
    });
    if (cfg.legend) { // horizontal legend in the top margin
      var lg = el('g', { class: 'legend' }, svg), lx = m.l, ly = 12;
      legendItems.forEach(function (s) {
        if (lx + legendW(s) > W - m.r) { lx = m.l; ly += 18; }
        var li = el('line', { x1: lx, x2: lx + 18, y1: ly, y2: ly, stroke: s.color, 'stroke-width': s.dash ? 2.5 : 4, 'stroke-linecap': s.dash ? 'butt' : 'round' }, lg);
        if (s.dash) li.setAttribute('stroke-dasharray', s.dash);
        var t = el('text', { x: lx + 24, y: ly + 4 }, lg); t.textContent = s.name;
        lx += legendW(s);
      });
    }
    if (cfg.after) cfg.after(svg, X, Y, plot);
    var chart = { svg: svg, X: X, Y: Y, paths: paths, m: m, W: W, H: H };
    chart.draw = function (instant) {
      paths.forEach(function (p) {
        if (p.getAttribute('stroke-dasharray')) return;
        var L = p.getTotalLength();
        p.style.strokeDasharray = L; p.style.strokeDashoffset = instant || reduceMotion ? 0 : L;
        p.getBoundingClientRect();
        p.classList.add('draw');
        p.style.strokeDashoffset = 0;
      });
      // static render: show markers/labels immediately instead of fading them in
      container.classList.toggle('is-static', !!(instant || reduceMotion));
      container.classList.add('is-drawn');
    };
    return chart;
  }
  function addText(svg, x, y, txt, attrs) {
    var t = el('text', Object.assign({ x: x, y: y }, attrs || {}), svg); t.textContent = txt; return t;
  }

  // Re-render charts when the theme toggles so colors follow.
  var redraws = [];
  new MutationObserver(function () { redraws.forEach(function (f) { f(true); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  var rsz = null;
  window.addEventListener('resize', function () {
    clearTimeout(rsz); rsz = setTimeout(function () { redraws.forEach(function (f) { f(true); }); }, 200);
  });
  function registerChart(id, render) {
    var c = document.getElementById(id); if (!c) return;
    var visible = false;
    redraws.push(function () { if (visible) render(c, true); });
    onVisible(c, function () { visible = true; render(c, false); }, 0.3);
    return function () { if (visible) render(c, true); };
  }


  window.FL = {
    root: root, reduceMotion: reduceMotion,
    $: $, $$: $$, css: css, onVisible: onVisible,
    el: el, lineChart: lineChart, addText: addText, registerChart: registerChart
  };
})();
