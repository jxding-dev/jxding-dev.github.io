/* =========================================================
   새벽상점 2025 그로스 리포트 — main.js
   - 스크롤리텔링 차트 (SVG를 JS가 data-에서 생성)
   - 단일 rAF 로 스크롤 연동 (읽기 진행률 / 씬 드로잉 / 연혁 스파인)
   - IntersectionObserver 로 활성 스텝 감지 · 카운트업(1회)
   - prefers-reduced-motion: 최종 상태 즉시 렌더
   ========================================================= */
(function () {
  "use strict";

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVGNS = "http://www.w3.org/2000/svg";

  document.body.classList.add("ready");

  /* ---------- 유틸 ---------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function el(tag, attrs, txt) {
    var n = document.createElementNS(SVGNS, tag), k;
    if (attrs) for (k in attrs) n.setAttribute(k, attrs[k]);
    if (txt != null) n.textContent = txt;
    return n;
  }
  function fmt(n) { return n.toLocaleString("ko-KR"); }

  /* ---------- 모바일 메뉴 ---------- */
  var hamb = document.querySelector(".hamb");
  var nav = document.getElementById("nav");
  if (hamb && nav) {
    hamb.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      hamb.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); hamb.setAttribute("aria-expanded", "false"); }
    });
  }

  /* =========================================================
     차트 빌더 — 각 차트를 SVG로 생성하고 draw(progress|step) 반환
     ========================================================= */

  /* --- 씬 1: 월별 주문량 라인 차트 --- */
  function buildLine(host) {
    var data = JSON.parse(host.getAttribute("data-values")); // 만건 단위 정수? -> 천건
    // data: 12개월, 단위 '건'(천 단위 정수). 표시는 만건.
    var W = 640, H = 420, padL = 46, padR = 24, padT = 34, padB = 46;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var maxY = 500; // 만? -> data는 천건, max 481천? 여기선 '천건' 값. y축 만건 라벨.
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "chart-svg", role: "img" });
    svg.setAttribute("aria-label", "2025년 월별 주문량 라인 차트. 1월 20.5만 건에서 12월 48.1만 건까지 우상향.");

    // 제목/단위
    svg.appendChild(el("text", { x: padL, y: 18, class: "chart-title" }, "월별 주문량 (단위: 만 건)"));

    // y 그리드 & 라벨 (0,10,20,30,40,50 만건 = 0,100,200,300,400,500 천건)
    var g, i, yv, py;
    for (i = 0; i <= 5; i++) {
      yv = i * 100;
      py = padT + plotH - (yv / maxY) * plotH;
      svg.appendChild(el("line", { x1: padL, y1: py, x2: W - padR, y2: py, class: "grid-line" }));
      svg.appendChild(el("text", { x: padL - 8, y: py + 3, class: "tick-label", "text-anchor": "end" }, (yv / 10)));
    }
    // x 위치
    var months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
    function X(idx) { return padL + (idx / 11) * plotW; }
    function Y(val) { return padT + plotH - (val / maxY) * plotH; }

    // 하이라이트 밴드 (5~8월, index 4~7)
    var bandX = X(4), bandX2 = X(7);
    var band = el("rect", { x: bandX, y: padT, width: bandX2 - bandX, height: plotH, class: "hl-band" });
    svg.appendChild(band);

    // x 라벨
    for (i = 0; i < 12; i++) {
      svg.appendChild(el("text", { x: X(i), y: H - padB + 16, class: "tick-label", "text-anchor": "middle" }, months[i]));
    }

    // 라인 path
    var d = "M " + X(0) + " " + Y(data[0]);
    for (i = 1; i < 12; i++) d += " L " + X(i) + " " + Y(data[i]);
    var path = el("path", { d: d, class: "data-line", pathLength: "1" });
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";
    svg.appendChild(path);

    // 주석: 부산 진출 (6월 근처)
    var annot = el("g", { class: "annot" });
    var ax = X(5), ay = Y(data[5]);
    annot.appendChild(el("line", { x1: ax, y1: ay - 10, x2: ax, y2: padT + 12, class: "annot-line" }));
    annot.appendChild(el("text", { x: ax + 4, y: padT + 10, class: "annot-text" }, "5월 · 부산 진출"));
    svg.appendChild(annot);

    // 최고점 도트 + 값 라벨 (12월)
    var peak = el("g", { class: "annot" });
    var pxp = X(11), pyp = Y(data[11]);
    var pulse = el("circle", { cx: pxp, cy: pyp, r: 6, class: "peak-pulse" });
    peak.appendChild(pulse);
    peak.appendChild(el("circle", { cx: pxp, cy: pyp, r: 4, class: "peak-dot" }));
    peak.appendChild(el("text", { x: pxp, y: pyp - 12, class: "val-label", "text-anchor": "end" }, (data[11] / 10).toFixed(1) + "만"));
    svg.appendChild(peak);

    host.appendChild(svg);

    // 펄스 애니메이션 (reduced-motion 아니면)
    var pulseRAF = null, t0 = 0;
    function pulseLoop(ts) {
      if (!t0) t0 = ts;
      var k = ((ts - t0) % 1600) / 1600;
      pulse.setAttribute("r", 4 + k * 12);
      pulse.style.opacity = 0.3 * (1 - k);
      pulseRAF = requestAnimationFrame(pulseLoop);
    }

    return function draw(p, maxStep) {
      path.style.strokeDashoffset = String(1 - p);
      if (maxStep >= 2) band.classList.add("on"); else band.classList.remove("on");
      if (maxStep >= 2) annot.classList.add("on"); else annot.classList.remove("on");
      if (maxStep >= 3 || p >= 0.99) {
        peak.classList.add("on");
        if (!RM && pulseRAF === null) pulseRAF = requestAnimationFrame(pulseLoop);
      } else {
        peak.classList.remove("on");
        if (pulseRAF !== null) { cancelAnimationFrame(pulseRAF); pulseRAF = null; t0 = 0; }
      }
    };
  }

  /* --- 씬 2: 지역별 버블 --- */
  function buildBubble(host) {
    var cities = JSON.parse(host.getAttribute("data-cities"));
    // [{name, val(천건), x, y, step, planned, amber}]
    var W = 640, H = 460;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "chart-svg", role: "img" });
    svg.setAttribute("aria-label", "지역별 누적 주문 버블 차트. 서울 172만, 경기 118만, 부산 52만, 인천 43만, 대구 27만 건. 2026년 대전·광주 진출 예정.");
    svg.appendChild(el("text", { x: 12, y: 20, class: "chart-title" }, "지역별 누적 주문 (2025, 원 넓이 = 주문량, 단위: 만 건)"));

    var maxV = 0, i;
    for (i = 0; i < cities.length; i++) if (!cities[i].planned && cities[i].val > maxV) maxV = cities[i].val;
    function R(v) { return 30 * Math.sqrt(v / maxV) + 14; }

    var groups = [];
    for (i = 0; i < cities.length; i++) {
      var c = cities[i], r = R(c.planned ? c.val : c.val);
      var g = el("g", { class: "bubble" + (c.planned ? " planned" : "") + (r < 40 ? " small" : "") });
      var circ = el("circle", { cx: c.x, cy: c.y, r: r });
      if (!c.planned) circ.setAttribute("class", c.amber ? "b-fill amber" : "b-fill");
      circ.style.transform = "scale(0)";
      g.appendChild(circ);
      var tName = el("text", { x: c.x, y: c.y + (r < 40 ? -2 : 0), "font-size": r < 40 ? 12 : 15 }, c.name);
      tName.style.opacity = "0"; tName.style.transition = "opacity .4s linear";
      g.appendChild(tName);
      var vtxt = (c.planned ? "예정 " : "") + (c.val / 10).toFixed(0) + "만";
      var tVal = el("text", { x: c.x, y: c.y + (r < 40 ? 12 : 18), class: "b-val" }, vtxt);
      tVal.setAttribute("fill", c.planned ? "#6C7470" : (r < 40 ? "#1A1F1C" : "#DCEDE2"));
      tVal.style.opacity = "0"; tVal.style.transition = "opacity .4s linear";
      g.appendChild(tVal);
      svg.appendChild(g);
      groups.push({ step: c.step, circ: circ, texts: [tName, tVal] });
    }
    host.appendChild(svg);

    return function draw(p, maxStep) {
      for (var i = 0; i < groups.length; i++) {
        var on = maxStep >= groups[i].step;
        groups[i].circ.style.transform = on ? "scale(1)" : "scale(0)";
        groups[i].texts[0].style.opacity = on ? "1" : "0";
        groups[i].texts[1].style.opacity = on ? "1" : "0";
      }
    };
  }

  /* --- 씬 3: 시간대별 막대 + 재구매 도넛 --- */
  function buildBarDonut(host) {
    var bars = JSON.parse(host.getAttribute("data-bars"));   // [{label, val(%), peak}]
    var repurchase = parseInt(host.getAttribute("data-repurchase"), 10); // 74
    var W = 640, H = 440;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "chart-svg", role: "img" });
    svg.setAttribute("aria-label", "배송 시간대별 주문 분포 막대 차트와 재구매율 74% 도넛. 새벽 4~6시가 41%로 최대.");

    // ------- 막대 (좌측) -------
    var bX = 44, bTop = 46, bBottom = 372, bW = 300;
    svg.appendChild(el("text", { x: 12, y: 22, class: "chart-title" }, "배송 시간대별 주문 분포 (단위: %)"));
    svg.appendChild(el("line", { x1: bX, y1: bBottom, x2: bX + bW, y2: bBottom, class: "axis-line" }));
    var maxBar = 0, i;
    for (i = 0; i < bars.length; i++) if (bars[i].val > maxBar) maxBar = bars[i].val;
    var slotW = bW / bars.length, barW = slotW * 0.56, plotH = bBottom - bTop;
    var barEls = [];
    for (i = 0; i < bars.length; i++) {
      var cx = bX + slotW * (i + 0.5);
      var full = (bars[i].val / 50) * plotH; // 50% 스케일
      var rect = el("rect", { x: cx - barW / 2, y: bBottom, width: barW, height: 0, class: "bar-rect" + (bars[i].peak ? " peak" : "") });
      svg.appendChild(rect);
      var vlabel = el("text", { x: cx, y: bBottom, class: "bar-val" }, bars[i].val + "%");
      vlabel.style.opacity = "0"; vlabel.style.transition = "opacity .3s linear";
      svg.appendChild(vlabel);
      // 시간 라벨 (2줄 가능)
      var parts = bars[i].label.split("\n");
      for (var j = 0; j < parts.length; j++) {
        svg.appendChild(el("text", { x: cx, y: bBottom + 16 + j * 12, class: "bar-label" }, parts[j]));
      }
      barEls.push({ rect: rect, full: full, y0: bBottom, val: vlabel, peak: bars[i].peak });
    }
    // 피크 주석
    var peakAnnot = el("g", { class: "annot" });
    for (i = 0; i < bars.length; i++) if (bars[i].peak) {
      var pcx = bX + slotW * (i + 0.5);
      peakAnnot.appendChild(el("text", { x: pcx, y: bTop - 4, class: "annot-text", "text-anchor": "middle" }, "전체의 " + bars.filter(function(b){return b.peak;})[0].val + "%"));
    }
    svg.appendChild(peakAnnot);

    // ------- 도넛 (우측) -------
    var dc = 490, dcy = 200, dr = 74;
    var C = 2 * Math.PI * dr;
    svg.appendChild(el("text", { x: dc, y: 22, class: "chart-title", "text-anchor": "middle" }, "재구매율"));
    svg.appendChild(el("circle", { cx: dc, cy: dcy, r: dr, class: "donut-track" }));
    var arc = el("circle", { cx: dc, cy: dcy, r: dr, class: "donut-arc",
      transform: "rotate(-90 " + dc + " " + dcy + ")" });
    arc.style.strokeDasharray = C;
    arc.style.strokeDashoffset = C;
    svg.appendChild(arc);
    var dnum = el("text", { x: dc, y: dcy + 4, class: "donut-num" }, "0%");
    svg.appendChild(dnum);
    svg.appendChild(el("text", { x: dc, y: dcy + 26, class: "donut-cap" }, "2025 누적"));

    host.appendChild(svg);

    return function draw(p, maxStep) {
      // 막대: p 0~0.6 구간에서 자람
      var bp = clamp(p / 0.6, 0, 1);
      for (var i = 0; i < barEls.length; i++) {
        var h = barEls[i].full * bp;
        barEls[i].rect.setAttribute("height", h);
        barEls[i].rect.setAttribute("y", barEls[i].y0 - h);
        barEls[i].val.setAttribute("y", barEls[i].y0 - h - 6);
        barEls[i].val.style.opacity = bp > 0.9 ? "1" : "0";
      }
      if (maxStep >= 2 && bp > 0.9) peakAnnot.classList.add("on"); else peakAnnot.classList.remove("on");
      // 도넛: p 0.55~1 구간
      var dp = clamp((p - 0.55) / 0.4, 0, 1);
      var frac = (repurchase / 100) * dp;
      arc.style.strokeDashoffset = String(C * (1 - frac));
      dnum.textContent = Math.round(repurchase * dp) + "%";
    };
  }

  /* =========================================================
     스크롤리텔링 배선
     ========================================================= */
  var scenes = [];
  document.querySelectorAll(".scrolly").forEach(function (sec) {
    var host = sec.querySelector(".chart-host");
    var type = host.getAttribute("data-chart");
    var draw = type === "line" ? buildLine(host)
             : type === "bubble" ? buildBubble(host)
             : buildBarDonut(host);
    var steps = Array.prototype.slice.call(sec.querySelectorAll(".step"));
    scenes.push({ sec: sec, draw: draw, steps: steps, maxProgress: 0, maxStep: 0, active: 0 });
  });

  // 활성 스텝 감지 — IO rootMargin -45% 0 -45%
  var stepIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var stepEl = e.target;
      var scene = scenes[+stepEl.getAttribute("data-scene-idx")];
      var idx = +stepEl.getAttribute("data-step");
      scene.steps.forEach(function (s) { s.classList.toggle("is-active", s === stepEl); });
      if (idx > scene.maxStep) scene.maxStep = idx;
      scene.active = idx;
      requestTick();
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

  scenes.forEach(function (scene, si) {
    scene.steps.forEach(function (s) {
      s.setAttribute("data-scene-idx", si);
      stepIO.observe(s);
    });
  });

  function sceneProgress(sec) {
    var rect = sec.getBoundingClientRect();
    var total = sec.offsetHeight - window.innerHeight;
    if (total <= 0) return rect.top <= 0 ? 1 : 0;
    return clamp(-rect.top / total, 0, 1);
  }

  /* ---------- 읽기 진행률 ---------- */
  var progFill = document.querySelector(".progress__fill");

  /* ---------- 연혁 스파인 (timeline.html) ---------- */
  var spineFill = document.querySelector(".tl__spine-fill");
  var tl = document.querySelector(".tl");

  /* ---------- 단일 rAF (on-demand — 스크롤/리사이즈 시에만 1프레임 예약) ---------- */
  var ticking = false;
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  function frame() {
    ticking = false;
    var vh = window.innerHeight;

    if (progFill) {
      var h = document.documentElement;
      var max = h.scrollHeight - vh;
      progFill.style.width = (max > 0 ? clamp(h.scrollTop / max, 0, 1) * 100 : 0) + "%";
    }

    scenes.forEach(function (scene) {
      var rect = scene.sec.getBoundingClientRect();
      if (rect.bottom < -50 || rect.top > vh + 50) return; // 뷰포트 밖 → 계산 정지
      var p = sceneProgress(scene.sec);
      if (p > scene.maxProgress) scene.maxProgress = p;  // 단조 증가 (되감기 재생 없음)
      scene.draw(scene.maxProgress, scene.maxStep);
    });

    if (spineFill && tl) {
      var r = tl.getBoundingClientRect();
      var tot = tl.offsetHeight - vh * 0.5;
      var sp = clamp((-r.top + vh * 0.5) / (tot > 0 ? tot : 1), 0, 1);
      spineFill.style.height = (sp * 100) + "%";
    }
  }

  // 초기 상태 & reduced-motion 처리
  if (RM) {
    scenes.forEach(function (scene) {
      scene.maxProgress = 1; scene.maxStep = 99;
      scene.steps.forEach(function (s) { s.classList.add("is-active"); });
      scene.draw(1, 99);
    });
    if (spineFill) spineFill.style.height = "100%";
    if (progFill) progFill.style.width = "100%";
  } else {
    scenes.forEach(function (scene) { scene.draw(0, 0); });
    requestTick(); // 초기 1프레임
  }

  /* =========================================================
     카운트업 (§1 KPI) — 진입 시 1회
     ========================================================= */
  function countUp(node) {
    var target = parseFloat(node.getAttribute("data-count"));
    var dec = parseInt(node.getAttribute("data-dec") || "0", 10);
    if (RM) { node.textContent = fmt(dec ? +target.toFixed(dec) : Math.round(target)); return; }
    var dur = 1400, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var k = clamp((ts - start) / dur, 0, 1); // linear
      var v = target * k;
      node.textContent = dec ? v.toFixed(dec) : fmt(Math.round(v));
      if (k < 1) requestAnimationFrame(tick);
      else node.textContent = dec ? target.toFixed(dec) : fmt(target);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var kpiIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { kpiIO.observe(c); });
  }

  /* ---------- 가로 막대 (team.html) 진입 시 1회 ---------- */
  var hbars = document.querySelectorAll(".hbar__fill[data-pct]");
  if (hbars.length) {
    var hbIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.getAttribute("data-pct") + "%";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    hbars.forEach(function (b) { if (RM) b.style.width = b.getAttribute("data-pct") + "%"; else hbIO.observe(b); });
  }

  /* ---------- 일반 reveal ---------- */
  var reveals = document.querySelectorAll(".js-reveal");
  if (reveals.length && !RM) {
    var rIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    reveals.forEach(function (r) { rIO.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }

})();
