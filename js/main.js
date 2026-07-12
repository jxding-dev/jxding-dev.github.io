/* 살롱 드 느와르 — 공통 스크립트 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // JS 로드 확인 → 히어로 진입 애니메이션 활성화 (JS 없으면 콘텐츠 기본 노출)
  document.body.classList.add('ready');

  /* ---------- 1. 헤더: 스크롤 시 배경 전환 ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. 모바일 드로어 메뉴 ---------- */
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

    // 메뉴 안 링크 클릭 시 닫힘
    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    // ESC로 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* ---------- 3. 스크롤 리빌 ---------- */
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

  /* ---------- 3-b. 이미지 커튼 리빌 ---------- */
  var curtainEls = document.querySelectorAll('.img-reveal');
  if (curtainEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      curtainEls.forEach(function (el) { el.classList.add('is-uncovered'); });
    } else {
      var curtainIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-uncovered');
            curtainIo.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      curtainEls.forEach(function (el) { curtainIo.observe(el); });
    }
  }

  /* ---------- 3-c. 통합 스크롤 패럴럭스 (rAF 1개, 인터루드·갤러리 공용) ---------- */
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
        if (el.offsetParent === null) { el.style.transform = ''; return; } // display:none(필터 숨김) 스킵
        // 갤러리 컬럼 패럴럭스는 데스크톱 전용
        if (el.hasAttribute('data-parallax-md') && window.innerWidth < 768) { el.style.transform = ''; return; }
        var f = parseFloat(el.getAttribute('data-parallax')) || 0;
        var r = el.getBoundingClientRect();
        var off = (r.top + r.height / 2) - cy;
        var ty = -off * f;
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

  /* ---------- 4. 숫자 카운트업 ---------- */
  var countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    var setFinal = function (el) {
      el.textContent = Number(el.getAttribute('data-count')).toLocaleString('ko-KR');
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      countEls.forEach(setFinal);
    } else {
      var animateCount = function (el) {
        var target = Number(el.getAttribute('data-count'));
        var duration = 1200;
        var start = null;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3); // ease-out
          el.textContent = Math.round(target * eased).toLocaleString('ko-KR');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCount(e.target);
            countIo.unobserve(e.target); // 한 번만 실행
          }
        });
      }, { threshold: 0.5 });
      countEls.forEach(function (el) { countIo.observe(el); });
    }
  }

  /* ---------- 5. Before/After 드래그 슬라이더 ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (frame) {
    var before = frame.querySelector('.ba-before');
    var handle = frame.querySelector('.ba-handle');
    if (!before || !handle) return;

    var setPos = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', String(Math.round(pct)));
    };

    setPos(50);

    var dragging = false;
    var userTouched = false;
    var demoRAF = null;
    var stopDemo = function () { userTouched = true; if (demoRAF) { cancelAnimationFrame(demoRAF); demoRAF = null; } };

    var posFromEvent = function (e) {
      var rect = frame.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    };

    frame.addEventListener('pointerdown', function (e) {
      stopDemo();
      dragging = true;
      frame.setPointerCapture(e.pointerId);
      setPos(posFromEvent(e));
    });

    frame.addEventListener('pointermove', function (e) {
      if (dragging) setPos(posFromEvent(e));
    });

    var stop = function () { dragging = false; };
    frame.addEventListener('pointerup', stop);
    frame.addEventListener('pointercancel', stop);

    // 키보드: 좌우 화살표로 5%씩 이동
    handle.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) !== -1) stopDemo();
      var now = Number(handle.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPos(now - 5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPos(now + 5);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPos(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setPos(100);
      }
    });

    // 오토 데모: 뷰포트 첫 진입 시 50→66→34→50 스윙 (1회, 조작 시 중단, reduced-motion 제외)
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var demoed = false;
      var runDemo = function () {
        var keys = [{ t: 0, v: 50 }, { t: 0.35, v: 66 }, { t: 0.7, v: 34 }, { t: 1, v: 50 }];
        var dur = 2200, start = null;
        var easeInOut = function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
        var frameStep = function (ts) {
          if (userTouched) return;
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          // 구간 보간
          var i = 0; while (i < keys.length - 1 && p > keys[i + 1].t) i++;
          var seg = (p - keys[i].t) / (keys[i + 1].t - keys[i].t || 1);
          var v = keys[i].v + (keys[i + 1].v - keys[i].v) * easeInOut(Math.max(0, Math.min(1, seg)));
          setPos(v);
          if (p < 1) demoRAF = requestAnimationFrame(frameStep);
        };
        demoRAF = requestAnimationFrame(frameStep);
      };
      var demoIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !demoed && !userTouched) { demoed = true; runDemo(); demoIo.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      demoIo.observe(frame);
    }
  });

  /* ---------- 6. 갤러리 필터 ---------- */
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var filterBtns = filterBar.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        galleryItems.forEach(function (item) {
          var show = filter === 'all' || item.getAttribute('data-category') === filter;
          if (show) {
            item.hidden = false;
            if (reduceMotion) {
              item.classList.remove('is-faded');
            } else {
              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  item.classList.remove('is-faded');
                });
              });
            }
          } else {
            item.classList.add('is-faded');
            item.hidden = true;
          }
        });
      });
    });
  }

  /* ---------- 7. 라이트박스 (dialog) ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('.lightbox-img');
    var lbCap = lightbox.querySelector('.lightbox-cap');
    var lbClose = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = thumb.querySelector('img');
        var cap = thumb.closest('.gallery-item').querySelector('figcaption');
        if (img && lbImg) {
          lbImg.src = img.getAttribute('src');
          lbImg.alt = img.getAttribute('alt') || '';
        }
        if (cap && lbCap) lbCap.textContent = cap.textContent;
        lightbox.showModal();
        document.body.style.overflow = 'hidden'; // 배경 스크롤 잠금
      });
    });

    if (lbClose) {
      lbClose.addEventListener('click', function () { lightbox.close(); });
    }

    // 배경(백드롭) 클릭 시 닫힘
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.close();
    });

    // 닫힐 때(ESC 포함) 스크롤 잠금 해제
    lightbox.addEventListener('close', function () {
      document.body.style.overflow = '';
    });
  }
})();
