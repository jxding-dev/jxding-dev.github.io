/* =========================================================
   달무렵 — main.js
   - 별 canvas(120개, 트윙클+느린 하강, 탭 비활성 정지)
   - 달 SVG 스크롤 진행 이동
   - 센터 스티키 폰 목업: 스크롤 진행도 → 3스텝 스크린 전환
   - reduced-motion: 목업 트랙 해체(정적 세로), 별·달 정지
   ========================================================= */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("ready");

  function clamp01(v){ return v<0?0:v>1?1:v; }
  function lerp(a,b,t){ return a+(b-a)*t; }

  /* ---------- 모바일 메뉴 ---------- */
  var hamb = document.querySelector(".hamb");
  var menu = document.getElementById("mobile-menu");
  if (hamb && menu){
    hamb.addEventListener("click", function(){
      var open = menu.classList.toggle("open");
      hamb.setAttribute("aria-expanded", open?"true":"false");
    });
    menu.addEventListener("click", function(e){ if(e.target.tagName==="A"){ menu.classList.remove("open"); hamb.setAttribute("aria-expanded","false"); } });
  }

  /* ---------- 헤더 스크롤 ---------- */
  var header = document.querySelector(".site-header");

  /* =========================================================
     별 canvas
     ========================================================= */
  var canvas = document.getElementById("stars");
  var stars = [], ctx, dpr = Math.min(window.devicePixelRatio||1, 2);
  function initStars(){
    if(!canvas) return;
    ctx = canvas.getContext("2d");
    resizeStars();
    stars = [];
    var n = 120, W = canvas.width, H = canvas.height;
    for(var i=0;i<n;i++){
      stars.push({
        x: Math.random(), y: Math.random(),
        r: (Math.random()*1.3 + 0.4) * dpr,
        a: Math.random()*0.5 + 0.35,
        sp: Math.random()*1.4 + 0.4,          // 트윙클 속도
        ph: Math.random()*Math.PI*2,
        fall: (Math.random()*0.006 + 0.002),  // 느린 하강 (정규화/초)
        lav: Math.random() < 0.22
      });
    }
  }
  function resizeStars(){
    if(!canvas) return;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }
  function drawStars(t){
    if(!ctx) return;
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<stars.length;i++){
      var s = stars[i];
      var alpha = s.a * (0.55 + 0.45*Math.sin(t*0.001*s.sp + s.ph));
      ctx.beginPath();
      ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
      ctx.fillStyle = s.lav ? "rgba(167,139,250," + alpha.toFixed(2) + ")"
                            : "rgba(245,244,255," + alpha.toFixed(2) + ")";
      ctx.fill();
    }
  }
  var starLast = 0;
  function starLoop(ts){
    if(document.hidden || RM) { starRAF = null; return; }
    // 하강 갱신
    var dt = starLast ? (ts - starLast) : 16; starLast = ts;
    for(var i=0;i<stars.length;i++){
      var s = stars[i];
      s.y += s.fall * (dt/1000);
      if(s.y > 1.02){ s.y = -0.02; s.x = Math.random(); }
    }
    drawStars(ts);
    starRAF = requestAnimationFrame(starLoop);
  }
  var starRAF = null;
  function startStars(){ if(starRAF===null && !document.hidden && !RM){ starLast=0; starRAF = requestAnimationFrame(starLoop); } }

  if(canvas){
    initStars();
    drawStars(0);                 // 최초 1프레임(정지 상태에서도 별 보이게)
    if(!RM) startStars();
    // 레이아웃이 늦게 잡혀 innerWidth=0 이었던 경우 보정
    window.addEventListener("load", function(){ resizeStars(); initStars(); drawStars(0); if(!RM) startStars(); });
    window.addEventListener("resize", function(){ resizeStars(); initStars(); drawStars(0); });
    document.addEventListener("visibilitychange", function(){
      if(document.hidden){ if(starRAF){ cancelAnimationFrame(starRAF); starRAF=null; } }
      else startStars();
    });
  }

  /* =========================================================
     스크롤 연동 (달 + 폰 스텝 + 헤더) — 단일 rAF on-demand
     ========================================================= */
  var moon = document.querySelector(".moon-orbit");
  var track = document.querySelector(".mock-track");
  var screens = track ? Array.prototype.slice.call(track.querySelectorAll(".screen")) : [];
  var copies = track ? Array.prototype.slice.call(track.querySelectorAll(".copy")) : [];
  var phone = track ? track.querySelector(".phone") : null;
  var rots = [-3, 0, 3];
  var curStep = -1;

  function setStep(step){
    if(step === curStep) return;
    curStep = step;
    screens.forEach(function(sc, i){
      sc.classList.remove("is-active","is-past","is-future");
      sc.classList.add(i===step ? "is-active" : i<step ? "is-past" : "is-future");
    });
    copies.forEach(function(cp, i){ cp.classList.toggle("is-on", i===step); });
    if(phone) phone.style.transform = "rotate(" + rots[step] + "deg)";
  }

  function onFrame(){
    ticking = false;
    var vh = window.innerHeight;
    var doc = document.documentElement;

    if(header) header.classList.toggle("scrolled", doc.scrollTop > 12);

    // 달: 페이지 진행에 따라 가로지름
    if(moon && !RM){
      var sp = clamp01(doc.scrollTop / Math.max(1, doc.scrollHeight - vh));
      var x = lerp(6, 80, sp);
      var y = 13 - Math.sin(sp*Math.PI)*7;
      moon.style.transform = "translate(" + x.toFixed(1) + "vw, " + y.toFixed(1) + "vh)";
    }

    // 폰 스텝
    if(track && !track.classList.contains("is-static")){
      var rect = track.getBoundingClientRect();
      var total = track.offsetHeight - vh;
      var p = total>0 ? clamp01(-rect.top/total) : 0;
      var step = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      setStep(step);
    }
  }

  var ticking = false;
  function requestTick(){ if(!ticking){ ticking=true; requestAnimationFrame(onFrame); } }
  window.addEventListener("scroll", requestTick, { passive:true });
  window.addEventListener("resize", requestTick);

  /* ---------- reduced-motion: 정적 해체 ---------- */
  if(track && RM){
    track.classList.add("is-static");
    screens.forEach(function(sc){ sc.classList.add("is-active"); });
    copies.forEach(function(cp){ cp.classList.add("is-on"); });
  }
  // 초기 상태
  if(track && !RM){ setStep(0); }
  requestTick();

  /* ---------- reveal (report 등) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if(reveals.length && !RM){
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    reveals.forEach(function(r){ io.observe(r); });
  } else {
    reveals.forEach(function(r){ r.classList.add("in"); });
  }

})();
