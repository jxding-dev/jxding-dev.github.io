/* =========================================================
   STUDIO MUGE — main.js
   ① 커스텀 커서 (관성 추적, 상태 변형, mix-blend) — 데스크톱 전용
   ② 가로 스크롤 인덱스 (세로 스크롤 진행도 → translateX, 하이재킹 없음)
   + 햄버거 / works 그리드·리스트·필터 / reduced-motion·터치 대응
   ========================================================= */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches;
  var COARSE = window.matchMedia("(pointer: coarse)").matches;
  document.body.classList.add("ready");

  function clamp(v,a,b){ return v<a?a:v>b?b:v; }
  function clamp01(v){ return clamp(v,0,1); }

  /* ---------- 햄버거 ---------- */
  var hamb = document.querySelector(".hamb");
  var overlay = document.getElementById("nav-overlay");
  if (hamb && overlay){
    var closeBtn = overlay.querySelector(".close");
    hamb.addEventListener("click", function(){ overlay.classList.add("open"); hamb.setAttribute("aria-expanded","true"); });
    function closeOv(){ overlay.classList.remove("open"); hamb.setAttribute("aria-expanded","false"); }
    if (closeBtn) closeBtn.addEventListener("click", closeOv);
    overlay.addEventListener("click", function(e){ if(e.target.tagName==="A") closeOv(); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeOv(); });
  }

  /* =========================================================
     ① 커스텀 커서
     ========================================================= */
  var cursor = null, cLabel = null;
  var tx = window.innerWidth/2, ty = window.innerHeight/2, px = tx, py = ty;
  var cursorRAF = null;

  function initCursor(){
    if(!FINE || COARSE) return;               // 터치/coarse → 기본 커서 유지
    cursor = document.createElement("div");
    cursor.className = "cursor";
    cLabel = document.createElement("span");
    cLabel.className = "cursor__label";
    cursor.appendChild(cLabel);
    document.body.appendChild(cursor);
    document.body.classList.add("has-cursor");

    window.addEventListener("mousemove", function(e){
      tx = e.clientX; ty = e.clientY;
      if(RM){ px=tx; py=ty; cursor.style.transform = "translate("+px+"px,"+py+"px) translate(-50%,-50%)"; }
      else startCursor();
      updateState(e.target);
    }, { passive:true });

    document.addEventListener("mouseleave", function(){ if(cursor) cursor.style.opacity="0"; });
    document.addEventListener("mouseenter", function(){ if(cursor) cursor.style.opacity="1"; });

    if(RM){ px=tx; py=ty; cursor.style.transform = "translate("+px+"px,"+py+"px) translate(-50%,-50%)"; }
    else startCursor();
  }
  function cursorLoop(){
    px += (tx - px) * 0.18;
    py += (ty - py) * 0.18;
    cursor.style.transform = "translate("+px.toFixed(1)+"px,"+py.toFixed(1)+"px) translate(-50%,-50%)";
    if(Math.abs(tx-px) > 0.1 || Math.abs(ty-py) > 0.1){ cursorRAF = requestAnimationFrame(cursorLoop); }
    else cursorRAF = null;
  }
  function startCursor(){ if(cursorRAF===null && cursor && !RM) cursorRAF = requestAnimationFrame(cursorLoop); }

  function updateState(el){
    if(!cursor) return;
    var view = el.closest && el.closest('[data-cursor="view"]');
    var drag = el.closest && el.closest('[data-cursor="drag"]');
    var link = el.closest && el.closest('a,button');
    cursor.classList.remove("is-view","is-drag","is-link");
    if(drag && !view){ cursor.classList.add("is-drag"); cLabel.textContent = "◀ 드래그 ▶"; }
    else if(view){ cursor.classList.add("is-view"); cLabel.textContent = "보기 ↗"; }
    else if(link){ cursor.classList.add("is-link"); cLabel.textContent = ""; }
    else cLabel.textContent = "";
  }

  /* =========================================================
     ② 가로 스크롤 인덱스
     ========================================================= */
  var track = document.querySelector(".h-track");
  var sticky = track ? track.querySelector(".h-sticky") : null;
  var rail = track ? track.querySelector(".h-rail") : null;
  var marker = track ? track.querySelector(".h-progress__marker") : null;
  var counter = track ? track.querySelector(".h-progress__count b") : null;
  var maxX = 0, panelsCount = 0, decomposed = false, dragInit = false;

  // 모드 결정: reduced-motion 또는 좁은 폭 → 세로 해체 / 넓은 폭 → 가로 스크롤
  // (숨김 탭 초기 innerWidth=0 으로 잘못 해체돼도 resize/load 에서 복구되도록 매번 재평가)
  function applyMode(){
    if(!track) return;
    if(RM || window.innerWidth <= 768){
      decomposed = true; track.classList.add("decompose"); track.style.height = "";
    } else {
      decomposed = false; track.classList.remove("decompose");
      layoutTrack();
      if(!dragInit){ initDrag(); dragInit = true; }
    }
  }

  function layoutTrack(){
    if(!track || !rail || decomposed) return;
    var vw = window.innerWidth;
    var stickyH = sticky.offsetHeight;
    maxX = Math.max(0, rail.scrollWidth - vw);
    track.style.height = (maxX + stickyH) + "px";
    panelsCount = rail.querySelectorAll(".panel:not(.panel--end)").length;
    updateHScroll();
  }
  function updateHScroll(){
    if(!track || decomposed) return;
    var rect = track.getBoundingClientRect();
    var total = track.offsetHeight - sticky.offsetHeight;
    var p = total > 0 ? clamp01(-rect.top / total) : 0;
    rail.style.transform = "translate3d(" + (-p * maxX).toFixed(1) + "px,0,0)";
    if(marker) marker.style.left = (p*100) + "%";
    if(counter){
      var idx = Math.min(panelsCount, Math.floor(p * (panelsCount + 0.001)) + 1);
      if(p >= 0.999) idx = panelsCount;
      counter.textContent = ("0"+idx).slice(-2);
    }
  }

  /* 가로 영역 드래그 → 페이지 스크롤(휠 하이재킹 아님) */
  function initDrag(){
    if(!sticky || COARSE) return;
    var dragging=false, startX=0, startScroll=0, moved=false;
    sticky.addEventListener("pointerdown", function(e){
      if(decomposed) return;
      dragging=true; moved=false; startX=e.clientX; startScroll=document.documentElement.scrollTop;
      sticky.setPointerCapture && sticky.setPointerCapture(e.pointerId);
    });
    sticky.addEventListener("pointermove", function(e){
      if(!dragging) return;
      var dx = e.clientX - startX;
      if(Math.abs(dx) > 4) moved=true;
      var factor = maxX>0 ? ((track.offsetHeight - sticky.offsetHeight)/maxX) : 1;
      window.scrollTo(0, startScroll - dx * factor);
    });
    function endDrag(e){ if(dragging){ dragging=false; try{ sticky.releasePointerCapture(e.pointerId); }catch(_){} } }
    sticky.addEventListener("pointerup", endDrag);
    sticky.addEventListener("pointercancel", endDrag);
    // 드래그 후 클릭 방지
    sticky.addEventListener("click", function(e){ if(moved){ e.preventDefault(); e.stopPropagation(); moved=false; } }, true);
  }

  /* =========================================================
     단일 rAF (on-demand) — 가로 스크롤 + 커서 상태 유지
     ========================================================= */
  var ticking=false;
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ ticking=false; updateHScroll(); }); } }
  window.addEventListener("scroll", onScroll, { passive:true });
  window.addEventListener("resize", function(){ if(track){ track.style.height=""; applyMode(); } });

  /* =========================================================
     works.html — 그리드/리스트 토글 · 필터 · 리스트 썸네일
     ========================================================= */
  var viewToggle = document.querySelector(".view-toggle");
  if(viewToggle){
    var gridView = document.querySelector(".grid-view");
    var listView = document.querySelector(".list-view");
    viewToggle.addEventListener("click", function(e){
      var b = e.target.closest("button"); if(!b) return;
      var v = b.getAttribute("data-view");
      viewToggle.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", x===b?"true":"false"); });
      if(v==="list"){ listView.classList.add("on"); gridView.classList.add("off"); }
      else { listView.classList.remove("on"); gridView.classList.remove("off"); }
    });
  }
  var filters = document.querySelector(".filters");
  if(filters){
    filters.addEventListener("click", function(e){
      var b = e.target.closest("button"); if(!b) return;
      var cat = b.getAttribute("data-cat");
      filters.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", x===b?"true":"false"); });
      document.querySelectorAll("[data-catof]").forEach(function(item){
        item.hidden = !(cat==="all" || item.getAttribute("data-catof")===cat);
      });
    });
  }
  // 리스트 행 썸네일(데스크톱)
  var listThumb = document.querySelector(".list-thumb");
  if(listThumb && FINE && !COARSE){
    var thumbImg = listThumb.querySelector("img");
    document.querySelectorAll(".list-row[data-thumb]").forEach(function(row){
      row.addEventListener("mouseenter", function(){ thumbImg.src = row.getAttribute("data-thumb"); listThumb.style.opacity="1"; });
      row.addEventListener("mousemove", function(e){ listThumb.style.left=e.clientX+"px"; listThumb.style.top=e.clientY+"px"; });
      row.addEventListener("mouseleave", function(){ listThumb.style.opacity="0"; });
    });
  }

  /* ---------- 초기화 ---------- */
  initCursor();
  if(track){
    applyMode();
    // 이미지 로드/폰트 후 재계산 (숨김 탭 초기 0폭 복구 포함)
    window.addEventListener("load", function(){ track.style.height=""; applyMode(); });
  }

})();
