/* 월간, 바다 — 공통 스크립트 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 헤더 스크롤 전환 ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScrollHeader = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
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
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 스크롤 연동 패럴럭스 (rAF 1개) — 이미지 라이브 + 텍스트 2레이어 ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduceMotion) {
    var pActive = [];
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target, i = pActive.indexOf(el);
        if (e.isIntersecting) { if (i < 0) pActive.push(el); }
        else { if (i >= 0) pActive.splice(i, 1); el.style.transform = ''; }
      });
    }, { rootMargin: '160px 0px' });
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

  /* ---------- 히어로 슬라이드쇼 ---------- */
  var hero = document.querySelector('.hero-slides');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-indicator button'));
    var idx = 0, timer = null, INTERVAL = 6000;

    var show = function (n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    };
    var start = function () {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = setInterval(function () { show(idx + 1); }, INTERVAL);
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); start(); });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    show(0);
    start();
  }

  /* ---------- 객실 스와이프 갤러리 ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (gal) {
    var track = gal.querySelector('.gallery-track');
    var prev = gal.querySelector('.gallery-arrow.prev');
    var next = gal.querySelector('.gallery-arrow.next');
    var dotsWrap = gal.querySelector('.gallery-dots');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.querySelectorAll('.gallery-slide'));

    // 도트 생성
    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', (i + 1) + '번 사진 보기');
        b.addEventListener('click', function () {
          track.scrollTo({ left: track.clientWidth * i, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    var current = function () { return Math.round(track.scrollLeft / track.clientWidth); };
    var update = function () {
      var c = current();
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === c ? 'true' : 'false'); });
      if (prev) prev.disabled = c <= 0;
      if (next) next.disabled = c >= slides.length - 1;
    };
    if (prev) prev.addEventListener('click', function () { track.scrollTo({ left: track.clientWidth * (current() - 1), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollTo({ left: track.clientWidth * (current() + 1), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // 오토 플레이: 뷰포트에 보이는 동안 5초 간격 다음 슬라이드(순환), 조작 시 영구 중단, 탭 비활성 정지
    if (!reduceMotion && slides.length > 1) {
      var userStopped = false, inView = false, autoTimer = null;
      var stopAuto = function () { userStopped = true; if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };
      var startAuto = function () {
        if (userStopped || autoTimer) return;
        autoTimer = setInterval(function () {
          if (document.hidden || !inView || userStopped) return;
          var nextIdx = (current() + 1) % slides.length;
          track.scrollTo({ left: track.clientWidth * nextIdx, behavior: 'smooth' });
        }, 5000);
      };
      // 사용자 조작(스와이프·버튼·도트·키보드) 시 영구 중단
      gal.addEventListener('pointerdown', stopAuto);
      gal.addEventListener('keydown', stopAuto);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { inView = e.isIntersecting; if (inView) startAuto(); });
        }, { threshold: 0.4 }).observe(gal);
      } else { inView = true; startAuto(); }
    }
  });

  /* ---------- 라이트박스 ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('.lightbox-img');
    var lbClose = lightbox.querySelector('.lightbox-close');
    document.querySelectorAll('[data-lightbox] .gallery-slide img').forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.getAttribute('src'); lbImg.alt = img.getAttribute('alt') || '';
        lightbox.showModal();
        document.body.style.overflow = 'hidden';
      });
    });
    if (lbClose) lbClose.addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('close', function () { document.body.style.overflow = ''; });
  }
})();
