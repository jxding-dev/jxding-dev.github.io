/* 묵도 커피 — 공통 스크립트 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // JS 로드 확인 → 클립 와이프 활성화 (JS 없으면 이미지 기본 노출)
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

  /* ---------- 모바일 드로어 메뉴 ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };
    navToggle.addEventListener('click', function () {
      setNav(!document.body.classList.contains('nav-open'));
    });
    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setNav(false);
        navToggle.focus();
      }
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
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 이미지 클립 와이프 ---------- */
  var wipeEls = document.querySelectorAll('.img-wipe');
  if (wipeEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      wipeEls.forEach(function (el) { el.classList.add('is-shown'); });
    } else {
      // threshold 0: 요소가 클립(inset 100%)으로 가려져 있어도 뷰포트에 걸치는 즉시 발화
      // (0.2로 두면 ratio가 0에 갇혀 콜백이 영영 안 뜨는 교착이 생김)
      var wipeIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-shown');
            wipeIo.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      wipeEls.forEach(function (el) { wipeIo.observe(el); });
    }
  }

  /* ---------- 가로 스크롤 카드 화살표 ---------- */
  document.querySelectorAll('[data-hscroll]').forEach(function (wrap) {
    var track = wrap.querySelector('.hscroll');
    var prev = wrap.querySelector('[data-hscroll-prev]');
    var next = wrap.querySelector('[data-hscroll-next]');
    if (!track) return;

    var step = function () {
      var card = track.querySelector('.sig-card');
      return card ? card.getBoundingClientRect().width + 22 : 340;
    };

    var updateBtns = function () {
      if (!prev || !next) return;
      var maxScroll = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll;
    };

    if (prev) prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    track.addEventListener('scroll', updateBtns, { passive: true });
    window.addEventListener('resize', updateBtns);
    updateBtns();
  });

  /* ---------- 메뉴 탭 (배너 이미지 교체 포함) ---------- */
  var tabList = document.querySelector('[role="tablist"]');
  if (tabList) {
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('.tab-btn'));
    var banner = document.querySelector('.menu-banner img');

    var activate = function (tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.setAttribute('tabindex', selected ? '0' : '-1');
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (banner) {
        var src = tab.getAttribute('data-banner');
        var alt = tab.getAttribute('data-banner-alt');
        if (src && banner.getAttribute('src') !== src) {
          if (reduceMotion) {
            banner.src = src; if (alt) banner.alt = alt;
          } else {
            banner.style.opacity = '0';
            setTimeout(function () {
              banner.src = src; if (alt) banner.alt = alt; banner.style.opacity = '1';
            }, 300);
          }
        }
      }
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(tab); });
      tab.addEventListener('keydown', function (e) {
        var idx = null;
        if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') idx = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = tabs.length - 1;
        if (idx !== null) {
          e.preventDefault();
          tabs[idx].focus();
          activate(tabs[idx]);
        }
      });
    });
  }

  /* ---------- 라이트박스 ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('.lightbox-img');
    var lbCap = lightbox.querySelector('.lightbox-cap');
    var lbClose = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('[data-lightbox]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = thumb.querySelector('img');
        if (img && lbImg) { lbImg.src = img.getAttribute('src'); lbImg.alt = img.getAttribute('alt') || ''; }
        if (lbCap) lbCap.textContent = thumb.getAttribute('data-caption') || (img ? img.getAttribute('alt') : '');
        lightbox.showModal();
        document.body.style.overflow = 'hidden';
      });
    });
    if (lbClose) lbClose.addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('close', function () { document.body.style.overflow = ''; });
  }
})();
