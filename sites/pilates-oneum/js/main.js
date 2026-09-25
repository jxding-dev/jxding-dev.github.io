/* 온음 스튜디오 — 공통 스크립트 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 모바일 드로어 ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };
    navToggle.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    mainNav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setNav(false); navToggle.focus(); }
    });
  }

  /* ---------- 스크롤 리빌 (잔잔) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 초저속 스크롤 패럴럭스 (rAF 1개) ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduceMotion) {
    var pActive = [];
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target, i = pActive.indexOf(el);
        if (e.isIntersecting) { if (i < 0) pActive.push(el); }
        else { if (i >= 0) pActive.splice(i, 1); el.style.transform = ''; }
      });
    }, { rootMargin: '140px 0px' });
    parallaxEls.forEach(function (el) { pio.observe(el); });
    var pTick = false;
    var pApply = function () {
      pTick = false;
      var cy = window.innerHeight / 2;
      pActive.forEach(function (el) {
        if (el.offsetParent === null) { el.style.transform = ''; return; }
        var f = parseFloat(el.getAttribute('data-parallax')) || 0;
        var r = el.getBoundingClientRect();
        var ty = -((r.top + r.height / 2) - cy) * f;
        var mx = parseFloat(el.getAttribute('data-parallax-max'));
        if (!isNaN(mx)) ty = Math.max(-mx, Math.min(mx, ty));
        el.style.transform = 'translateY(' + ty.toFixed(1) + 'px)';
      });
    };
    var pOnScroll = function () { if (!pTick) { pTick = true; requestAnimationFrame(pApply); } };
    window.addEventListener('scroll', pOnScroll, { passive: true });
    window.addEventListener('resize', pOnScroll);
    pApply();
  }

  /* ---------- 요일 탭 (접속 요일 기본 활성) ---------- */
  var dayTablist = document.querySelector('[data-day-tabs]');
  if (dayTablist) {
    var dayTabs = Array.prototype.slice.call(dayTablist.querySelectorAll('.day-tab'));
    var activateDay = function (tab) {
      dayTabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    };
    dayTabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activateDay(tab); });
      tab.addEventListener('keydown', function (e) {
        var idx = null;
        if (e.key === 'ArrowRight') idx = (i + 1) % dayTabs.length;
        else if (e.key === 'ArrowLeft') idx = (i - 1 + dayTabs.length) % dayTabs.length;
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = dayTabs.length - 1;
        if (idx !== null) { e.preventDefault(); dayTabs[idx].focus(); activateDay(dayTabs[idx]); }
      });
    });
    // 오늘 요일을 기본 활성 (월=0 ... 일=6 으로 매핑; getDay는 일=0)
    var jsDay = new Date().getDay();          // 일0 월1 ... 토6
    var idxToday = (jsDay + 6) % 7;           // 월0 ... 일6
    if (dayTabs[idxToday]) activateDay(dayTabs[idxToday]);
  }

  /* ---------- 가격 그룹/개인 토글 ---------- */
  var priceToggle = document.querySelector('[data-price-toggle]');
  if (priceToggle) {
    var toggleBtns = Array.prototype.slice.call(priceToggle.querySelectorAll('button'));
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        var target = btn.getAttribute('data-target');
        document.querySelectorAll('.price-set').forEach(function (set) {
          set.hidden = set.getAttribute('data-set') !== target;
        });
      });
    });
  }
})();
