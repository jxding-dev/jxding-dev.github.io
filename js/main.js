/* =========================================================
   SEOUL DEV WAVE 2026 — main.js
   ① 키네틱 타이포(스크롤 델타 → translateX 클램프, 관성 없음, 별 회전)
   ② 매트릭스 타임테이블(데이터→CSS Grid, 탭, dialog, ✱ localStorage)
   + 타자기 자막 · D-day 카운트다운 · 연사 dialog · 햄버거
   ========================================================= */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("ready");
  function clamp(v,a,b){ return v<a?a:v>b?b:v; }
  function pad(n){ return (n<10?"0":"")+n; }

  /* ---------- 햄버거 ---------- */
  var hamb = document.querySelector(".hamb");
  var menu = document.getElementById("mobile-menu");
  if(hamb && menu){
    hamb.addEventListener("click", function(){ var o=menu.classList.toggle("open"); hamb.setAttribute("aria-expanded", o?"true":"false"); });
    menu.addEventListener("click", function(e){ if(e.target.closest("a")){ menu.classList.remove("open"); hamb.setAttribute("aria-expanded","false"); } });
  }

  /* ---------- D-day 카운트다운 ---------- */
  var TARGET = new Date("2026-10-16T09:00:00+09:00").getTime();
  var ddayDays = document.querySelectorAll("[data-dday-days]");
  var ddayFull = document.querySelectorAll("[data-dday-full]");
  function tickCountdown(){
    var now = Date.now();
    var diff = Math.max(0, TARGET - now);
    var d = Math.floor(diff/86400000);
    var h = Math.floor(diff%86400000/3600000);
    var m = Math.floor(diff%3600000/60000);
    var s = Math.floor(diff%60000/1000);
    ddayDays.forEach(function(el){ el.textContent = d; });
    ddayFull.forEach(function(el){ el.textContent = "D-" + d + " · " + pad(h)+":"+pad(m)+":"+pad(s); });
  }
  var cdTimer = null;
  function startCountdown(){ if(cdTimer===null){ tickCountdown(); cdTimer = setInterval(tickCountdown, 1000); } }
  function stopCountdown(){ if(cdTimer!==null){ clearInterval(cdTimer); cdTimer = null; } }
  if(ddayDays.length || ddayFull.length){
    startCountdown();
    document.addEventListener("visibilitychange", function(){ if(document.hidden) stopCountdown(); else startCountdown(); });
  }

  /* =========================================================
     ① 키네틱 타이포
     ========================================================= */
  var lines = Array.prototype.slice.call(document.querySelectorAll(".board__line"));
  var star = document.querySelector(".star");
  function applyKinetic(){
    var y = document.documentElement.scrollTop || window.scrollY || 0;
    var maxPx = window.innerWidth * 0.06;   // ±6vw 클램프
    lines.forEach(function(ln){
      var dir = parseFloat(ln.getAttribute("data-dir")) || 0;
      var tx = clamp(y * 0.08 * dir, -maxPx, maxPx);
      ln.style.transform = "translateX(" + tx.toFixed(1) + "px)";
    });
    if(star) star.style.transform = "rotate(" + (y*0.15).toFixed(1) + "deg)";
  }
  var kTick=false;
  function onScroll(){ if(!kTick){ kTick=true; requestAnimationFrame(function(){ kTick=false; applyKinetic(); }); } }
  if(lines.length && !RM){
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", applyKinetic);
    applyKinetic();
  }

  /* ---------- 타자기 자막 (IO 1회) ---------- */
  var ticker = document.querySelector(".ticker");
  if(ticker){
    if(RM){ ticker.classList.add("typed"); }
    else {
      var tIO = new IntersectionObserver(function(entries, obs){
        entries.forEach(function(e){ if(e.isIntersecting){ ticker.classList.add("typed"); obs.disconnect(); } });
      }, { threshold: 0.6 });
      tIO.observe(ticker);
    }
  }

  /* ---------- 연사 프리뷰/카드 dialog ---------- */
  var spkDialog = document.getElementById("spk-dialog");
  if(spkDialog){
    var d_name = spkDialog.querySelector("[data-f=name]");
    var d_org = spkDialog.querySelector("[data-f=org]");
    var d_bio = spkDialog.querySelector("[data-f=bio]");
    var d_ses = spkDialog.querySelector("[data-f=ses]");
    var d_sum = spkDialog.querySelector("[data-f=sum]");
    document.querySelectorAll(".spk-card[data-name]").forEach(function(card){
      card.addEventListener("click", function(){
        d_name.textContent = card.getAttribute("data-name");
        d_org.textContent = card.getAttribute("data-org");
        d_bio.textContent = card.getAttribute("data-bio");
        d_ses.textContent = card.getAttribute("data-ses");
        d_sum.textContent = card.getAttribute("data-sum");
        if(typeof spkDialog.showModal==="function") spkDialog.showModal(); else spkDialog.setAttribute("open","");
      });
    });
    spkDialog.querySelectorAll("[data-close]").forEach(function(b){ b.addEventListener("click", function(){ spkDialog.close(); }); });
    spkDialog.addEventListener("click", function(e){ if(e.target===spkDialog) spkDialog.close(); });
  }

  /* =========================================================
     ② 매트릭스 타임테이블
     ========================================================= */
  var ttRoot = document.getElementById("timetable");
  if(ttRoot){
    var TRACKS = { A:"트랙 A · AI", B:"트랙 B · 웹", C:"트랙 C · 인프라" };
    var DATA = {
      1: [
        {id:"d1-key", tr:"ALL", s:"10:00", e:"10:40", t:"오프닝 키노트 — 파도는 어디서 오는가", spk:"운영위원회", lv:"전체"},
        {id:"d1-a1", tr:"A", s:"11:00", e:"11:50", t:"LLM 에이전트를 프로덕션에 넣으며 배운 것", spk:"김러너", lv:"중급"},
        {id:"d1-b1", tr:"B", s:"11:00", e:"11:50", t:"2026년의 CSS는 JS를 얼마나 대체했나", spk:"박코어", lv:"중급"},
        {id:"d1-c1", tr:"C", s:"11:00", e:"11:50", t:"쿠버네티스 없이 버티는 법", spk:"이인프라", lv:"고급"},
        {id:"d1-lunch", tr:"ALL", s:"12:00", e:"13:00", t:"점심 · 네트워킹", spk:"", lv:"", brk:true},
        {id:"d1-a2", tr:"A", s:"13:00", e:"13:40", t:"RAG 파이프라인 비용까지 최적화하기", spk:"정벡터", lv:"중급"},
        {id:"d1-b2", tr:"B", s:"13:00", e:"13:40", t:"뷰 트랜지션으로 만드는 매끄러운 화면", spk:"한모션", lv:"초급"},
        {id:"d1-c2", tr:"C", s:"13:00", e:"13:40", t:"관측 가능성 3요소 실전 적용", spk:"오메트릭", lv:"중급"},
        {id:"d1-a3", tr:"A", s:"14:00", e:"14:40", t:"온디바이스 추론, 지금 어디까지 왔나", spk:"최엣지", lv:"중급"},
        {id:"d1-b3", tr:"B", s:"14:00", e:"14:40", t:"접근성은 옵션이 아니라 기본값", spk:"유에이와이", lv:"초급"},
        {id:"d1-c3", tr:"C", s:"14:00", e:"14:40", t:"제로 다운타임 배포 전략", spk:"남릴리즈", lv:"고급"},
        {id:"d1-brk", tr:"ALL", s:"15:00", e:"15:20", t:"커피 브레이크", spk:"", lv:"", brk:true},
        {id:"d1-a4", tr:"A", s:"15:30", e:"16:10", t:"파인튜닝 대신 프롬프트로 버티기", spk:"서프롬", lv:"초급"},
        {id:"d1-b4", tr:"B", s:"15:30", e:"16:10", t:"웹어셈블리로 60fps 지켜내기", spk:"강웜", lv:"고급"},
        {id:"d1-c4", tr:"C", s:"15:30", e:"16:10", t:"비용까지 설계하는 클라우드", spk:"문코스트", lv:"중급"},
        {id:"d1-lt", tr:"ALL", s:"16:30", e:"17:10", t:"라이트닝 토크 (10분 × 4)", spk:"공모 연사", lv:"전체"},
        {id:"d1-close", tr:"ALL", s:"17:30", e:"18:00", t:"Day 1 클로징", spk:"운영위원회", lv:"전체"}
      ],
      2: [
        {id:"d2-key", tr:"ALL", s:"10:00", e:"10:40", t:"Day 2 키노트 — 다음 파도를 준비하며", spk:"운영위원회", lv:"전체"},
        {id:"d2-a1", tr:"A", s:"11:00", e:"11:50", t:"멀티모달 모델 서빙 아키텍처", spk:"조멀티", lv:"고급"},
        {id:"d2-b1", tr:"B", s:"11:00", e:"11:50", t:"프레임워크 없이 만드는 인터랙션", spk:"신바닐라", lv:"중급"},
        {id:"d2-c1", tr:"C", s:"11:00", e:"11:50", t:"데이터베이스 마이그레이션 무중단으로", spk:"권스키마", lv:"고급"},
        {id:"d2-lunch", tr:"ALL", s:"12:00", e:"13:00", t:"점심 · 커리어 상담존", spk:"", lv:"", brk:true},
        {id:"d2-a2", tr:"A", s:"13:00", e:"13:40", t:"평가 없는 AI는 배포하지 말자", spk:"배평가", lv:"중급"},
        {id:"d2-b2", tr:"B", s:"13:00", e:"13:40", t:"타입스크립트 5년 차의 후회", spk:"타입러", lv:"초급"},
        {id:"d2-c2", tr:"C", s:"13:00", e:"13:40", t:"엣지 런타임 완전 정복", spk:"엣지님", lv:"중급"},
        {id:"d2-panel", tr:"ALL", s:"14:00", e:"14:50", t:"패널 — 주니어 개발자의 다음 파도", spk:"연사 6인", lv:"전체"},
        {id:"d2-close", tr:"ALL", s:"15:10", e:"15:40", t:"클로징 & 애프터파티 안내", spk:"운영위원회", lv:"전체"}
      ]
    };
    var START = 600, END = 1080, UNIT = 10; // 10:00~18:00, 10분 단위
    var trackIndex = { A:0, B:1, C:2 };
    function toMin(hhmm){ var p=hhmm.split(":"); return (+p[0])*60 + (+p[1]); }

    var grid = ttRoot.querySelector(".tt-grid");
    var list = ttRoot.querySelector(".tt-list");
    var tabs = ttRoot.querySelectorAll(".tt-tabs button");
    var ttDialog = document.getElementById("tt-dialog");
    var curDay = 1;

    function isSaved(id){ try{ return localStorage.getItem("dw-my-"+id)==="1"; }catch(e){ return false; } }
    function setSaved(id,v){ try{ v?localStorage.setItem("dw-my-"+id,"1"):localStorage.removeItem("dw-my-"+id); }catch(e){} }

    function render(day){
      curDay = day;
      var rows = (END-START)/UNIT;
      // 매트릭스
      grid.innerHTML = "";
      grid.style.gridTemplateColumns = "64px repeat(3,1fr)";
      grid.style.gridTemplateRows = "auto repeat("+rows+", 14px)";
      // 헤더
      grid.appendChild(cell("tt-colhead",""));
      ["A","B","C"].forEach(function(k){ grid.appendChild(cell("tt-colhead", TRACKS[k])); });
      // 시간 라벨 (매시)
      for(var mnt=START; mnt<END; mnt+=60){
        var r = (mnt-START)/UNIT + 2;
        var lab = cell("tt-time", pad(Math.floor(mnt/60))+":00");
        lab.style.gridColumn = "1"; lab.style.gridRow = r + " / span 6";
        grid.appendChild(lab);
      }
      // 세션
      DATA[day].forEach(function(ses){
        var rs = (toMin(ses.s)-START)/UNIT + 2;
        var span = (toMin(ses.e)-toMin(ses.s))/UNIT;
        var node;
        if(ses.brk){
          node = document.createElement("div");
          node.className = "tt-break";
          node.style.gridColumn = "2 / 5"; node.style.gridRow = rs+" / span "+span;
          node.innerHTML = '<div class="tt-session" style="background:none;border:0;cursor:default;"><span class="tm">'+ses.s+'</span><span class="ttl">'+ses.t+'</span></div>';
          grid.appendChild(node); return;
        }
        node = document.createElement("button");
        node.type = "button";
        node.className = "tt-session tk-" + (ses.tr==="ALL"?"A":ses.tr) + (isSaved(ses.id)?" saved":"");
        node.style.gridColumn = ses.tr==="ALL" ? "2 / 5" : String(2+trackIndex[ses.tr]);
        node.style.gridRow = rs + " / span " + span;
        node.innerHTML = ttInner(ses);
        node.addEventListener("click", function(){ openSession(ses); });
        grid.appendChild(node);
      });

      // 모바일 리스트
      list.innerHTML = "";
      DATA[day].slice().sort(function(a,b){ return toMin(a.s)-toMin(b.s); }).forEach(function(ses){
        var b = document.createElement("button");
        b.type="button";
        b.className = "tt-session tk-" + (ses.tr==="ALL"?"A":ses.tr) + (ses.brk?" tt-break":"") + (isSaved(ses.id)?" saved":"");
        b.style.margin = "0"; b.style.borderBottom = "1px solid rgba(245,245,242,.12)";
        b.innerHTML = '<span class="tm">'+ses.s+"–"+ses.e+' · '+(ses.tr==="ALL"?"전체":"트랙 "+ses.tr)+'</span><span class="ttl">'+(isSaved(ses.id)?'<span class="saved-mark">✱ </span>':'')+ses.t+'</span>'+(ses.spk?'<span class="spk">'+ses.spk+'</span>':'');
        if(!ses.brk) b.addEventListener("click", function(){ openSession(ses); });
        list.appendChild(b);
      });
    }
    function ttInner(ses){
      return '<span class="tm">'+ses.s+(isSaved(ses.id)?' <span class="saved-mark">✱</span>':'')+'</span><span class="ttl">'+ses.t+'</span>'+(ses.spk?'<span class="spk">'+ses.spk+'</span>':'');
    }
    function cell(cls, txt){ var d=document.createElement("div"); d.className=cls; d.textContent=txt; return d; }

    function openSession(ses){
      if(!ttDialog) return;
      ttDialog.querySelector("[data-f=title]").textContent = ses.t;
      ttDialog.querySelector("[data-f=meta]").textContent = (ses.tr==="ALL"?"전체 세션":TRACKS[ses.tr]) + " · " + ses.s + "–" + ses.e + (ses.lv?" · "+ses.lv:"");
      ttDialog.querySelector("[data-f=spk]").textContent = ses.spk || "운영위원회";
      var btn = ttDialog.querySelector("[data-save]");
      function sync(){ btn.textContent = isSaved(ses.id) ? "✱ 내 시간표에서 빼기" : "＋ 내 시간표에 담기"; }
      sync();
      btn.onclick = function(){ setSaved(ses.id, !isSaved(ses.id)); sync(); render(curDay); };
      if(typeof ttDialog.showModal==="function") ttDialog.showModal(); else ttDialog.setAttribute("open","");
    }
    if(ttDialog){
      ttDialog.querySelectorAll("[data-close]").forEach(function(b){ b.addEventListener("click", function(){ ttDialog.close(); }); });
      ttDialog.addEventListener("click", function(e){ if(e.target===ttDialog) ttDialog.close(); });
    }
    tabs.forEach(function(t){ t.addEventListener("click", function(){
      tabs.forEach(function(x){ x.setAttribute("aria-selected", x===t?"true":"false"); });
      render(+t.getAttribute("data-day"));
    }); });
    render(1);
  }

})();
