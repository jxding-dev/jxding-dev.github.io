/* 노션 클래스 — 공통 스크립트 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('ready');

  /* ---------- 무한 마퀴: 뷰포트 밖·탭 비활성 시 정지 ---------- */
  var marquees = Array.prototype.slice.call(document.querySelectorAll('[data-marquee]'));
  if (marquees.length && !reduceMotion) {
    var updateMq = function (m) { m.classList.toggle('is-paused', !!m._off || document.hidden); };
    if ('IntersectionObserver' in window) {
      var mqIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.target._off = !e.isIntersecting; updateMq(e.target); });
      }, { threshold: 0 });
      marquees.forEach(function (m) { mqIo.observe(m); });
    }
    document.addEventListener('visibilitychange', function () { marquees.forEach(updateMq); });
  }

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

  /* ---------- 스크롤 리빌 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.14 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 후기 캐러셀 ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (wrap) {
    var track = wrap.querySelector('.carousel');
    var prev = wrap.querySelector('[data-carousel-prev]');
    var next = wrap.querySelector('[data-carousel-next]');
    if (!track) return;
    var step = function () { var c = track.querySelector('.review-card'); return c ? c.getBoundingClientRect().width + 16 : 340; };
    var update = function () {
      if (!prev || !next) return;
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- 카운트다운 (로드 시점 + 5일) ---------- */
  var cdEls = document.querySelectorAll('[data-countdown]');
  if (cdEls.length) {
    var target = Date.now() + 5 * 24 * 60 * 60 * 1000;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      // ceil: 남은 시간이 5일이면 첫 24시간 동안 "D-5"로 표기 (배너 관례)
      var d = Math.ceil(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      cdEls.forEach(function (el) {
        el.innerHTML = '<span class="cd-d">D-' + d + '</span> <span>' + pad(h) + ':' + pad(m) + ':' + pad(s) + '</span>';
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 지표 카운트업 ---------- */
  var countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    var setFinal = function (el) {
      var t = Number(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = t.toLocaleString('ko-KR') + suffix;
    };
    if (reduceMotion || !('IntersectionObserver' in window)) {
      countEls.forEach(setFinal);
    } else {
      var animate = function (el) {
        var t = Number(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1300, start = null;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(t * eased).toLocaleString('ko-KR') + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.5 });
      countEls.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- 스티키 CTA 바 ---------- */
  var sticky = document.getElementById('stickyCta');
  if (sticky) {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('stickyCtaClosed') === '1'; } catch (e) {}
    var closeBtn = sticky.querySelector('.sticky-close');

    var applyPad = function (on) {
      document.body.style.paddingBottom = on ? (sticky.offsetHeight + 'px') : '';
    };
    var onScroll = function () {
      if (dismissed) return;
      var show = window.scrollY > 400;
      sticky.classList.toggle('is-shown', show);
      applyPad(show);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { if (sticky.classList.contains('is-shown')) applyPad(true); });
    onScroll();

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dismissed = true;
        sticky.classList.remove('is-shown');
        applyPad(false);
        try { sessionStorage.setItem('stickyCtaClosed', '1'); } catch (e) {}
      });
    }
  }
})();
