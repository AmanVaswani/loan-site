
/* ═══════════════════════════════════════════════════════════════
   LOAN KI BAAT — single-file application layer
   1. utilities  2. behaviours  3. router  4. page modules
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmtIN = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

  /* ── 1. UTILITIES ───────────────────────────────────────── */
  var LKB = window.LKB = {
    reduce: REDUCE,
    fmt: function (n) { return fmtIN.format(Math.round(n)); },
    money: function (n) { return '\u20B9' + fmtIN.format(Math.round(n)); },
    compact: function (n) {
      if (n >= 10000000) return '\u20B9' + (n / 10000000).toFixed(2) + ' Cr';
      if (n >= 100000)   return '\u20B9' + (n / 100000).toFixed(2) + ' L';
      if (n >= 1000)     return '\u20B9' + (n / 1000).toFixed(1) + ' K';
      return '\u20B9' + Math.round(n);
    },
    emi: function (P, annual, months) {
      if (months <= 0) return 0;
      var r = annual / 12 / 100;
      if (r === 0) return P / months;
      var f = Math.pow(1 + r, months);
      return P * r * f / (f - 1);
    },
    paint: function (el) {
      var mn = parseFloat(el.min), mx = parseFloat(el.max);
      el.style.setProperty('--pct', ((parseFloat(el.value) - mn) / (mx - mn) * 100) + '%');
    },
    $: function (id) { return document.getElementById(id); }
  };

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ── 2. SHARED BEHAVIOURS ───────────────────────────────── */

  /* range painting */
  all('input[type=range]').forEach(function (r) {
    LKB.paint(r);
    r.addEventListener('input', function () { LKB.paint(r); });
  });

  /* scroll progress + sticky header */
  var progress = LKB.$('progress');
  var header = document.querySelector('.site-header');

  function updateTracks() {
    all('.tl').forEach(function (tl) {
      var fill = tl.querySelector('.tl-fill');
      if (!fill) return;
      var r = tl.getBoundingClientRect();
      if (!r.height) return;
      var p = Math.max(0, Math.min(1, (window.innerHeight * 0.72 - r.top) / r.height));
      fill.style.transform = 'scaleX(' + p + ')';
      var steps = tl.querySelectorAll('.tl-step');
      Array.prototype.forEach.call(steps, function (s, i) {
        s.classList.toggle('on', p >= (i / steps.length) * 0.92);
      });
    });
    all('.milestones').forEach(function (ms) {
      var fill = ms.querySelector('.ms-fill');
      if (!fill) return;
      var r = ms.getBoundingClientRect();
      if (!r.height) return;
      var p = Math.max(0, Math.min(1, (window.innerHeight * 0.68 - r.top) / r.height));
      fill.style.transform = 'scaleY(' + p + ')';
      var items = ms.querySelectorAll('.ms');
      Array.prototype.forEach.call(items, function (s, i) {
        s.classList.toggle('on', p >= (i / items.length) * 0.85);
      });
    });
  }

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
    if (header) header.classList.toggle('scrolled', window.scrollY > 14);
    updateTracks();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile nav */
  var navToggle = LKB.$('navToggle');
  var nav = LKB.$('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* word-by-word headline reveal */
  function wrapWords(root) {
    var out = '';
    Array.prototype.forEach.call(root.childNodes, function (node) {
      if (node.nodeType === 3) {
        node.nodeValue.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { out += p; return; }
          out += '<span class="w"><span class="wi">' + p + '</span></span>';
        });
      } else if (node.nodeType === 1) {
        if (node.tagName === 'BR') { out += '<br>'; return; }
        if (node.classList.contains('foil')) {
          out += '<span class="w"><span class="wi">' + node.outerHTML + '</span></span>';
        } else {
          var clone = node.cloneNode(false);
          clone.innerHTML = wrapWords(node);
          out += clone.outerHTML;
        }
      }
    });
    return out;
  }

  all('.split').forEach(function (el) {
    if (REDUCE) { el.classList.add('no-anim'); return; }
    el.innerHTML = wrapWords(el);
    all('.wi', el).forEach(function (w, i) { w.style.transitionDelay = (i * 0.052) + 's'; });
  });

  /* reveal observer (handles hidden routes automatically) */
  var revealEls = all('.reveal, .reveal-blur, .split');
  if ('IntersectionObserver' in window && !REDUCE) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in', 'no-anim'); });
  }

  /* accordions */
  function setAcc(item, open) {
    var body = item.querySelector('.faq-a');
    if (!body) return;
    item.classList.toggle('open', open);
    var btn = item.querySelector('.faq-q');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.style.maxHeight = open ? (body.scrollHeight + 'px') : '0px';
  }

  all('.faq-list').forEach(function (list) {
    var items = list.querySelectorAll('.faq-item');
    Array.prototype.forEach.call(items, function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        Array.prototype.forEach.call(items, function (o) { setAcc(o, false); });
        setAcc(item, !isOpen);
      });
      setAcc(item, item.classList.contains('open'));
    });
    window.addEventListener('resize', function () {
      Array.prototype.forEach.call(items, function (i) {
        if (i.classList.contains('open')) setAcc(i, true);
      });
    });
  });

  /* trend chart self-draw */
  if ('IntersectionObserver' in window) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          all('.trend-line,.trend-area,.trend-dot', en.target).forEach(function (n) { n.classList.add('drawn'); });
          tio.unobserve(en.target);
        }
      });
    }, { threshold: 0.25 });
    all('.trend-card').forEach(function (c) { tio.observe(c); });
  } else {
    all('.trend-line,.trend-area,.trend-dot').forEach(function (n) { n.classList.add('drawn'); });
  }

  /* animated counters */
  var counters = all('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        if (REDUCE) {
          el.textContent = prefix + target.toFixed(dec) + suffix;
        } else {
          var t0 = null, dur = 1500;
          (function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var e2 = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + (target * e2).toFixed(dec) + suffix;
            if (p < 1) requestAnimationFrame(step);
          })();
        }
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* forms */
  all('.js-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      all('[required]', form).forEach(function (f) {
        if (f.type === 'checkbox') {
          if (!f.checked) { ok = false; f.classList.add('err'); } else f.classList.remove('err');
          return;
        }
        if (!f.value.trim()) { f.classList.add('err'); ok = false; }
        else f.classList.remove('err');
        if (f.type === 'tel' && !/^\d{10}$/.test(f.value.trim())) { f.classList.add('err'); ok = false; }
      });
      if (!ok) return;

      var nameEl = form.querySelector('#fName') || form.querySelector('#cName') || form.querySelector('input[type=text]');
      var phoneEl = form.querySelector('#fPhone') || form.querySelector('#cPhone') || form.querySelector('input[type=tel]');
      var emailEl = form.querySelector('#cEmail') || form.querySelector('input[type=email]');
      var loanEl = form.querySelector('#fLoan') || form.querySelector('#cLoan');
      var amountEl = form.querySelector('#fAmount') || form.querySelector('#cAmount');
      var cityEl = form.querySelector('#fCity') || form.querySelector('#cCity');
      var employEl = form.querySelector('#fEmploy') || form.querySelector('#cEmploy');

      var payload = {
        name: nameEl ? nameEl.value.trim() : 'Website Lead',
        phone: phoneEl ? phoneEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
        loanType: loanEl ? loanEl.value : '',
        loanAmount: amountEl ? amountEl.value : '',
        city: cityEl ? cityEl.value.trim() : '',
        employmentType: employEl ? employEl.value : '',
        message: 'Lead submitted via Loan ki Baat quote form'
      };

      var btn = form.querySelector('[type=submit]');
      if (btn) {
        btn.innerHTML = 'Sending...';
        btn.disabled = true;
      }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) { return res.json(); })
      .catch(function (err) { console.warn('Submission fallback:', err); })
      .finally(function () {
        var success = form.querySelector('.form-success');
        if (success) success.classList.add('show');
        if (btn) {
          btn.innerHTML = 'Request Received \u2713';
          btn.style.background = 'var(--green-600)';
        }
        setTimeout(function () {
          form.reset();
          if (btn) {
            btn.disabled = false;
            btn.style.background = '';
            btn.innerHTML = 'Request My Callback <span class="arw">\u2192</span>';
          }
        }, 3000);
      });
    });

    all('[required]', form).forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('err'); });
      f.addEventListener('change', function () { f.classList.remove('err'); });
    });
  });

  /* hero parallax */
  if (!REDUCE) {
    var heroVisual = document.querySelector('.hero-visual');
    var floats = document.querySelectorAll('.float');
    if (heroVisual || floats.length) {
      window.addEventListener('mousemove', function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5);
        var cy = (e.clientY / window.innerHeight - 0.5);
        Array.prototype.forEach.call(floats, function (f, i) {
          var d = (i + 1) * 12;
          f.style.marginLeft = (-cx * d) + 'px';
          f.style.marginTop = (-cy * d) + 'px';
        });
        if (heroVisual) heroVisual.style.transform = 'translate3d(' + (-cx * 8) + 'px,' + (-cy * 8) + 'px,0)';
      }, { passive: true });
    }
  }

  /* ── 3. ROUTER ──────────────────────────────────────────── */
  var navLinks = all('.nav a[data-page]');

  function showRoute() {
    var raw = (location.hash || '').replace(/^#\/?/, '');
    var parts = raw.split('/').filter(Boolean);
    var page = parts[0] || 'home';
    var anchor = parts.slice(1).join('/');

    var target = LKB.$('page-' + page);
    if (!target) {
      anchor = parts.join('/');
      page = 'home';
      target = LKB.$('page-home');
    }

    all('.route').forEach(function (r) { r.classList.toggle('active', r === target); });

    navLinks.forEach(function (a) {
      a.setAttribute('aria-current', a.getAttribute('data-page') === page ? 'page' : 'false');
    });

    /* loans sub-nav highlight */
    all('.subnav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#/' + page + (anchor ? '/' + anchor : ''));
    });

    if (nav) nav.classList.remove('open');
    if (navToggle) navToggle.classList.remove('open');

    requestAnimationFrame(function () {
      if (anchor) {
        var t = document.getElementById(anchor);
        if (t) {
          window.scrollTo(0, t.getBoundingClientRect().top + window.pageYOffset - 100);
          return;
        }
      }
      window.scrollTo(0, 0);
      onScroll();
    });

    /* re-arm reveals and tracks for the now-visible route */
    requestAnimationFrame(function () {
      all('.reveal, .reveal-blur, .split', target).forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('in');
      });
      onScroll();
    });
  }

  window.addEventListener('hashchange', showRoute);
  showRoute();

  /* smooth anchors (non-router hashes only) */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;

    if (id === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' });
      return;
    }
    if (id.indexOf('#/') === 0) return;          /* router link — let hashchange handle it */

    var t = document.getElementById(id.slice(1));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({
      top: t.getBoundingClientRect().top + window.pageYOffset - 100,
      behavior: REDUCE ? 'auto' : 'smooth'
    });
  });

  /* ── 4. PAGE MODULES ────────────────────────────────────── */
  var fmt = LKB.fmt, money = LKB.money, compact = LKB.compact, emi = LKB.emi;

  /* ── 4a. HOME: quick EMI ── */
  (function () {
    var qAmt = LKB.$('qAmt'), qRate = LKB.$('qRate'), qTen = LKB.$('qTen');
    if (!qAmt) return;

    function render() {
      var P = +qAmt.value, R = +qRate.value, Y = +qTen.value;
      var e = emi(P, R, Y * 12), total = e * Y * 12;
      LKB.$('qEmi').textContent = fmt(e);
      LKB.$('qCap').textContent = 'for ' + Y + (Y === 1 ? ' year' : ' years') + ' at ' + R.toFixed(2) + '% p.a.';
      LKB.$('qP').textContent = compact(P);
      LKB.$('qI').textContent = compact(total - P);
      LKB.$('qT').textContent = compact(total);
      LKB.$('qAmtV').textContent = money(P);
      LKB.$('qRateV').textContent = R.toFixed(2) + '% p.a.';
      LKB.$('qTenV').textContent = Y + (Y === 1 ? ' Year' : ' Years');
    }
    [qAmt, qRate, qTen].forEach(function (el) { el.addEventListener('input', render); });

    LKB.$('qeChips').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      all('.chip', this).forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      qAmt.value = chip.getAttribute('data-amt');
      qRate.value = chip.getAttribute('data-rate');
      qTen.value = chip.getAttribute('data-ten');
      render();
    });
    render();
  })();

  /* ── 4b. shared rate-board renderer ── */
  function renderBoard(hostId, rows) {
    var host = LKB.$(hostId);
    if (!host || !rows || !rows.length) return;
    var avg = rows.reduce(function (a, b) { return a + b.rate; }, 0) / rows.length;
    var min = Math.min.apply(null, rows.map(function (r) { return r.rate; }));

    host.innerHTML = rows.map(function (r, i) {
      var best = r.rate === min;
      var d = r.rate - avg;
      return '<div class="brow bdata' + (best ? ' best' : '') + '" style="animation-delay:' + (i * 0.055) + 's">' +
        '<div class="lender"><div class="mono-tile">' + r.mono + '</div>' +
        '<div><div class="nm">' + r.n + (best ? ' <span class="best-tag">Best Rate</span>' : '') + '</div>' +
        '<div class="sub">' + r.sub + '</div></div></div>' +
        '<div class="rate-cell"><div class="r tab-num">' + r.rate.toFixed(2) + '%</div>' +
        '<div class="delta ' + (d < 0 ? 'down' : 'up') + '">' + (d < 0 ? '' : '+') + d.toFixed(2) + '% vs market</div></div>' +
        '<div class="cell-mono">' + r.fee + '</div>' +
        '<div class="cell-mono col-hide">' + r.amt + '</div>' +
        '<div class="cell-mono col-hide">' + r.ten + '</div>' +
        '<div style="text-align:right"><a href="#/contact/form" class="btn btn-gold btn-sm">Apply</a></div></div>';
    }).join('');
  }

  var BOARD = {
    personal: [
      { n: 'HDFC Bank', mono: 'HD', sub: 'Private Bank', rate: 10.49, fee: 'Up to 2.50%', amt: '₹50K – ₹40L', ten: '1 – 6 yrs' },
      { n: 'ICICI Bank', mono: 'IC', sub: 'Private Bank', rate: 10.75, fee: 'Up to 2.25%', amt: '₹50K – ₹50L', ten: '1 – 6 yrs' },
      { n: 'Bajaj Finserv', mono: 'BF', sub: 'NBFC', rate: 11.00, fee: 'Up to 3.00%', amt: '₹1L – ₹40L', ten: '1 – 6 yrs' },
      { n: 'Tata Capital', mono: 'TC', sub: 'NBFC', rate: 11.25, fee: 'Up to 2.75%', amt: '₹50K – ₹35L', ten: '1 – 6 yrs' },
      { n: 'Axis Bank', mono: 'AX', sub: 'Private Bank', rate: 11.50, fee: 'Up to 2.00%', amt: '₹50K – ₹40L', ten: '1 – 5 yrs' },
      { n: 'Kotak Mahindra', mono: 'KM', sub: 'Private Bank', rate: 11.75, fee: 'Up to 2.50%', amt: '₹50K – ₹30L', ten: '1 – 5 yrs' }
    ],
    home: [
      { n: 'State Bank of India', mono: 'SB', sub: 'Public Bank', rate: 8.35, fee: '0.35% + GST', amt: '₹5L – ₹5Cr', ten: 'Up to 30 yrs' },
      { n: 'HDFC Bank', mono: 'HD', sub: 'Private Bank', rate: 8.50, fee: '0.50% + GST', amt: '₹5L – ₹5Cr', ten: 'Up to 30 yrs' },
      { n: 'Punjab National Bank', mono: 'PN', sub: 'Public Bank', rate: 8.60, fee: '0.35% + GST', amt: '₹5L – ₹2Cr', ten: 'Up to 30 yrs' },
      { n: 'Bank of Baroda', mono: 'BB', sub: 'Public Bank', rate: 8.70, fee: '0.40% + GST', amt: '₹5L – ₹3Cr', ten: 'Up to 30 yrs' },
      { n: 'ICICI Bank', mono: 'IC', sub: 'Private Bank', rate: 8.85, fee: '0.50% + GST', amt: '₹5L – ₹5Cr', ten: 'Up to 30 yrs' },
      { n: 'Axis Bank', mono: 'AX', sub: 'Private Bank', rate: 9.05, fee: '0.60% + GST', amt: '₹5L – ₹5Cr', ten: 'Up to 30 yrs' }
    ],
    business: [
      { n: 'Tata Capital', mono: 'TC', sub: 'NBFC', rate: 11.00, fee: 'Up to 2.50%', amt: '₹1L – ₹2Cr', ten: '1 – 10 yrs' },
      { n: 'HDFC Bank', mono: 'HD', sub: 'Private Bank', rate: 11.25, fee: 'Up to 2.00%', amt: '₹1L – ₹2Cr', ten: '1 – 10 yrs' },
      { n: 'Bajaj Finserv', mono: 'BF', sub: 'NBFC', rate: 11.50, fee: 'Up to 3.00%', amt: '₹1L – ₹1Cr', ten: '1 – 8 yrs' },
      { n: 'ICICI Bank', mono: 'IC', sub: 'Private Bank', rate: 12.00, fee: 'Up to 2.25%', amt: '₹1L – ₹2Cr', ten: '1 – 10 yrs' },
      { n: 'Sidbi Partner', mono: 'SI', sub: 'Govt Scheme', rate: 12.25, fee: '0.75% + GST', amt: '₹1L – ₹5Cr', ten: '1 – 10 yrs' },
      { n: 'Kotak Mahindra', mono: 'KM', sub: 'Private Bank', rate: 12.50, fee: 'Up to 2.50%', amt: '₹1L – ₹1Cr', ten: '1 – 7 yrs' }
    ],
    car: [
      { n: 'State Bank of India', mono: 'SB', sub: 'Public Bank', rate: 8.75, fee: '0.50% + GST', amt: '₹1L – ₹1.5Cr', ten: '1 – 7 yrs' },
      { n: 'HDFC Bank', mono: 'HD', sub: 'Private Bank', rate: 8.90, fee: '0.60% + GST', amt: '₹1L – ₹1.5Cr', ten: '1 – 7 yrs' },
      { n: 'Bank of Baroda', mono: 'BB', sub: 'Public Bank', rate: 9.05, fee: '0.50% + GST', amt: '₹1L – ₹50L', ten: '1 – 7 yrs' },
      { n: 'Mahindra Finance', mono: 'MF', sub: 'NBFC', rate: 9.25, fee: 'Up to 2.00%', amt: '₹1L – ₹30L', ten: '1 – 7 yrs' },
      { n: 'Axis Bank', mono: 'AX', sub: 'Private Bank', rate: 9.45, fee: '0.65% + GST', amt: '₹1L – ₹1.5Cr', ten: '1 – 7 yrs' },
      { n: 'ICICI Bank', mono: 'IC', sub: 'Private Bank', rate: 9.65, fee: '0.70% + GST', amt: '₹1L – ₹1Cr', ten: '1 – 7 yrs' }
    ],
    education: [
      { n: 'State Bank of India', mono: 'SB', sub: 'Public Bank', rate: 8.50, fee: 'Nil up to ₹7.5L', amt: '₹50K – ₹1.5Cr', ten: 'Up to 15 yrs' },
      { n: 'Bank of Baroda', mono: 'BB', sub: 'Public Bank', rate: 8.75, fee: '1.00% + GST', amt: '₹50K – ₹1.5Cr', ten: 'Up to 15 yrs' },
      { n: 'Punjab National Bank', mono: 'PN', sub: 'Public Bank', rate: 8.90, fee: '1.00% + GST', amt: '₹50K – ₹75L', ten: 'Up to 15 yrs' },
      { n: 'HDFC Bank', mono: 'HD', sub: 'Private Bank', rate: 9.25, fee: '1.50% + GST', amt: '₹50K – ₹1.5Cr', ten: 'Up to 15 yrs' },
      { n: 'Avanse (Panel)', mono: 'AV', sub: 'NBFC', rate: 9.75, fee: '1.00% + GST', amt: '₹50K – ₹1Cr', ten: 'Up to 12 yrs' },
      { n: 'Axis Bank', mono: 'AX', sub: 'Private Bank', rate: 10.25, fee: '1.50% + GST', amt: '₹50K – ₹75L', ten: 'Up to 12 yrs' }
    ],
    gold: [
      { n: 'Muthoot Panel', mono: 'MU', sub: 'NBFC', rate: 9.00, fee: 'Nil – 1.00%', amt: '₹10K – ₹50L', ten: '3 – 24 months' },
      { n: 'Manappuram Panel', mono: 'MA', sub: 'NBFC', rate: 9.25, fee: 'Nil – 1.00%', amt: '₹10K – ₹25L', ten: '3 – 24 months' },
      { n: 'State Bank of India', mono: 'SB', sub: 'Public Bank', rate: 9.50, fee: '0.50% + GST', amt: '₹20K – ₹50L', ten: '3 – 36 months' },
      { n: 'Bank of Baroda', mono: 'BB', sub: 'Public Bank', rate: 9.75, fee: '0.50% + GST', amt: '₹20K – ₹25L', ten: '3 – 24 months' },
      { n: 'HDFC Bank', mono: 'HD', sub: 'Private Bank', rate: 10.00, fee: '1.00% + GST', amt: '₹25K – ₹25L', ten: '3 – 24 months' },
      { n: 'Federal Panel', mono: 'FD', sub: 'Private Bank', rate: 10.25, fee: '0.75% + GST', amt: '₹10K – ₹20L', ten: '3 – 24 months' }
    ]
  };

  /* ── 4c. HOME: teaser board + product grid ── */
  renderBoard('homeBoardRows', BOARD.home.slice(0, 5));

  (function () {
    var host = LKB.$('prodGrid');
    if (!host) return;

    var ICONS = {
      personal: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V21h14V9.8"/><path d="M10 21v-6h4v6"/>',
      business: '<rect x="2" y="7" width="20" height="14" rx="2.5"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M2 13h20"/>',
      car: '<path d="M5 17h14"/><path d="M6 17v2M18 17v2"/><path d="M3 13l1.7-5A2.5 2.5 0 0 1 7.1 6.5h9.8a2.5 2.5 0 0 1 2.4 1.7L21 13v4H3z"/><circle cx="7.5" cy="14" r="1"/><circle cx="16.5" cy="14" r="1"/>',
      education: '<path d="M12 4 2 9l10 5 10-5-10-5z"/><path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/>',
      gold: '<path d="M3 9h18l-2 10H5L3 9z"/><path d="M8 9V6.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V9"/>'
    };

    var PRODUCTS = [
      { name: 'Personal Loan', slug: 'personal', rate: 'From 10.49%', desc: 'Unsecured funding for weddings, medical needs or debt consolidation — no collateral, minimal paperwork, disbursal within a day of sanction.',
        specs: [['Loan Amount', '₹50K – ₹40L'], ['Tenure', '1 – 6 Years'], ['Disbursal', 'Within 24 Hours']] },
      { name: 'Home Loan', slug: 'home', rate: 'From 8.35%', desc: 'Buy, build, extend or renovate with long-tenure financing, competitive balance-transfer options and full support on approvals and registration.',
        specs: [['Loan Amount', '₹5L – ₹5 Cr'], ['Tenure', 'Up to 30 Years'], ['Sanction', '7 – 12 Days']] },
      { name: 'Business Loan', slug: 'business', rate: 'From 11.00%', desc: 'Working capital, machinery or expansion funding for MSMEs — including unsecured options assessed on banking turnover rather than collateral.',
        specs: [['Loan Amount', '₹1L – ₹2 Cr'], ['Tenure', '1 – 10 Years'], ['Sanction', '3 – 5 Days']] },
      { name: 'Car Loan', slug: 'car', rate: 'From 8.75%', desc: 'New or pre-owned, hatchback to SUV — competitive funding with high on-road coverage and help with dealer negotiation.',
        specs: [['Loan Amount', '₹1L – ₹1.5 Cr'], ['Tenure', '1 – 7 Years'], ['Disbursal', 'Within 48 Hours']] },
      { name: 'Education Loan', slug: 'education', rate: 'From 8.50%', desc: 'Fund tuition, living and travel for studies in India or abroad, with a moratorium period that begins repayment only after the course ends.',
        specs: [['Loan Amount', '₹50K – ₹1.5 Cr'], ['Tenure', 'Up to 15 Years'], ['Sanction', '5 – 10 Days']] },
      { name: 'Gold Loan', slug: 'gold', rate: 'From 9.00%', desc: 'Instant liquidity against gold jewellery with transparent valuation, fully insured custody and simple interest-only repayment options.',
        specs: [['Loan Amount', '₹10K – ₹50 L'], ['Tenure', '3 – 24 Months'], ['Disbursal', 'Within 30 Minutes']] }
    ];

    host.innerHTML = PRODUCTS.map(function (p, i) {
      return '<article class="prod-card reveal" style="transition-delay:' + (i * 0.06) + 's">' +
        '<div class="ghost">0' + (i + 1) + '</div>' +
        '<div class="ico"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + ICONS[p.slug] + '</svg></div>' +
        '<h3>' + p.name + '</h3><p>' + p.desc + '</p>' +
        '<div class="specs">' + p.specs.map(function (s) {
          return '<div class="spec"><span>' + s[0] + '</span><span class="lead-dots"></span><b>' + s[1] + '</b></div>';
        }).join('') + '</div>' +
        '<div class="foot"><a href="#/loans/' + p.slug + '" class="link-arw">' + p.rate + ' · Learn more →</a></div>' +
        '</article>';
    }).join('');
  })();

  /* ── 4d. shared savings comparator factory ── */
  function initSavings(cfg) {
    var amt = LKB.$(cfg.amt);
    if (!amt) return;
    var cur = LKB.$(cfg.cur), nw = LKB.$(cfg.new);
    var frame = null, last = 0;

    function animTo(target) {
      var el = LKB.$(cfg.big);
      if (REDUCE) { el.textContent = fmt(target); last = target; return; }
      var start = last, t0 = null, dur = 620;
      if (frame) cancelAnimationFrame(frame);
      (function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(start + (target - start) * e);
        if (p < 1) frame = requestAnimationFrame(step); else last = target;
      })();
    }

    function render() {
      var P = +amt.value, rc = +cur.value, rn = +nw.value;
      if (rn > rc) { rn = rc; nw.value = rn; }
      var totalCur = emi(P, rc, 240) * 240, totalNew = emi(P, rn, 240) * 240;
      var saved = Math.max(totalCur - totalNew, 0);
      animTo(saved);
      LKB.$(cfg.cap).innerHTML =
        'That\'s <b>' + (saved / emi(P, rn, 240)).toFixed(0) + ' months</b> of EMIs you\'d never have to pay — over a 20-year loan at ' +
        rn.toFixed(2) + '% instead of ' + rc.toFixed(2) + '%.';
      LKB.$(cfg.nowTxt).textContent = compact(totalCur - P) + ' interest';
      LKB.$(cfg.newTxt).textContent = compact(totalNew - P) + ' interest';
      LKB.$(cfg.nowBar).style.width = '100%';
      LKB.$(cfg.newBar).style.width = Math.max((totalNew / totalCur) * 100, 12) + '%';
      LKB.$(cfg.amtV).textContent = money(P);
      LKB.$(cfg.curV).textContent = rc.toFixed(2) + '%';
      LKB.$(cfg.newV).textContent = rn.toFixed(2) + '%';
    }

    [amt, cur, nw].forEach(function (el) { el.addEventListener('input', render); });
    render();
  }

  initSavings({
    amt: 'hAmt', amtV: 'hAmtV', cur: 'hCur', curV: 'hCurV', new: 'hNew', newV: 'hNewV',
    big: 'hBig', cap: 'hSavCap', nowTxt: 'hCmpNow', newTxt: 'hCmpNew',
    nowBar: 'hCmpNowBar', newBar: 'hCmpNewBar'
  });

  initSavings({
    amt: 'vAmt', amtV: 'vAmtV', cur: 'vCur', curV: 'vCurV', new: 'vNew', newV: 'vNewV',
    big: 'savBig', cap: 'savCaption', nowTxt: 'cmpNow', newTxt: 'cmpNew',
    nowBar: 'cmpNowBar', newBar: 'cmpNewBar'
  });

  /* ── 4e. RATES: board tabs + rate impact ── */
  (function () {
    var tabs = LKB.$('boardTabs');
    if (!tabs) return;

    renderBoard('ratesBoardRows', BOARD.personal);
    tabs.addEventListener('click', function (e) {
      var t = e.target.closest('.tab');
      if (!t) return;
      all('.tab', this).forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      renderBoard('ratesBoardRows', BOARD[t.getAttribute('data-key')]);
    });

    var riAmt = LKB.$('riAmt'), riTen = LKB.$('riTen'), riRate = LKB.$('riRate');
    var TIERS = [
      { label: 'Best available in market', rate: 8.35 },
      { label: 'Strong profile · A-tier lender', rate: 8.95 },
      { label: 'Average market pricing', rate: 9.65 },
      { label: 'Weaker profile / NBFC', rate: 11.25 }
    ];

    function renderImpact() {
      var P = +riAmt.value, Y = +riTen.value, R = +riRate.value;
      var e = emi(P, R, Y * 12);
      LKB.$('riEmi').textContent = fmt(e);
      LKB.$('riCap').textContent = 'at ' + R.toFixed(2) + '% over ' + Y + (Y === 1 ? ' year' : ' years');
      LKB.$('riAmtV').textContent = money(P);
      LKB.$('riTenV').textContent = Y + (Y === 1 ? ' Year' : ' Years');
      LKB.$('riRateV').textContent = R.toFixed(2) + '%';

      var bestEmi = emi(P, TIERS[0].rate, Y * 12);
      LKB.$('riRows').innerHTML = TIERS.map(function (t) {
        return '<div class="qe-row"><span>' + t.label + ' · ' + t.rate.toFixed(2) + '%</span>' +
          '<b class="tab-num">₹' + fmt(emi(P, t.rate, Y * 12)) + '/mo</b></div>';
      }).join('') +
        '<div class="qe-row" style="background:rgba(226,188,106,.18);border-color:rgba(226,188,106,.35)">' +
        '<span style="color:var(--gold-300)">Best-case saving on your offer</span>' +
        '<b class="tab-num" style="color:#fff">' + compact(Math.max(e * Y * 12 - bestEmi * Y * 12, 0)) + '</b></div>';
    }
    [riAmt, riTen, riRate].forEach(function (el) { el.addEventListener('input', renderImpact); });
    renderImpact();
  })();

  /* ── 4f. TOOLS: amortisation engine ── */
  function amortise(P, rate, years, extra) {
    var r = rate / 12 / 100, months = years * 12;
    var e = emi(P, rate, months);
    var yearly = [], bal = P, totalInterest = 0, firstYearInt = 0, m = 0, yInt = 0, yPrin = 0;
    while (bal > 0.5 && m < months) {
      var int = bal * r;
      var pay = Math.min(e + extra, bal + int);
      var prin = pay - int;
      if (prin <= 0) break;
      bal -= prin; totalInterest += int; yInt += int; yPrin += prin; m++;
      if (m % 12 === 0 || bal <= 0.5) {
        yearly.push({ bal: Math.max(bal, 0), int: yInt, prin: yPrin, year: Math.ceil(m / 12) });
        if (yearly.length === 1) firstYearInt = yInt;
        yInt = 0; yPrin = 0;
      }
    }
    return { emi: e, months: m, yearly: yearly, totalInterest: totalInterest, firstYearInt: firstYearInt };
  }

  /* ── 4g. TOOLS: EMI studio ── */
  (function () {
    var sAmt = LKB.$('sAmt');
    if (!sAmt) return;

    var sRate = LKB.$('sRate'), sTen = LKB.$('sTen'), sPre = LKB.$('sPre');
    var C = 2 * Math.PI * 72;

    (function ticks() {
      var host = LKB.$('gaugeTicks');
      var svgns = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgns, 'svg');
      svg.setAttribute('viewBox', '0 0 186 186');
      for (var i = 0; i < 48; i++) {
        var a = (i / 48) * Math.PI * 2, inner = i % 4 === 0 ? 84 : 88;
        var l = document.createElementNS(svgns, 'line');
        l.setAttribute('x1', 93 + Math.cos(a) * inner); l.setAttribute('y1', 93 + Math.sin(a) * inner);
        l.setAttribute('x2', 93 + Math.cos(a) * 91);   l.setAttribute('y2', 93 + Math.sin(a) * 91);
        l.setAttribute('stroke', i % 4 === 0 ? 'rgba(226,188,106,.55)' : 'rgba(255,255,255,.18)');
        l.setAttribute('stroke-width', '1.4');
        svg.appendChild(l);
      }
      host.appendChild(svg);
    })();

    function renderAmort(data, P) {
      var bars = LKB.$('amortBars'), labels = LKB.$('amortLabels');
      var list = data.yearly, maxBal = Math.max(P, 1);
      bars.innerHTML = ''; labels.innerHTML = '';
      list.forEach(function (y, i) {
        var pct = Math.max((y.bal / maxBal) * 100, 2.2);
        var ratio = y.int / Math.max(y.int + y.prin, 1);
        var col = document.createElement('div');
        col.className = 'bar-col';
        col.innerHTML =
          '<div class="tip">Yr ' + y.year + ' · Bal ' + compact(y.bal) + ' · Int ' + compact(y.int) + '</div>' +
          '<div class="seg" style="height:' + (pct * ratio) + '%;background:linear-gradient(180deg,#E2BC6A,#C8942E)"></div>' +
          '<div class="seg" style="height:' + (pct * (1 - ratio)) + '%;background:linear-gradient(180deg,#2E9E5B,#136B3E)"></div>';
        bars.appendChild(col);
        var step = list.length > 18 ? 4 : (list.length > 10 ? 2 : 1);
        var lab = document.createElement('span');
        lab.textContent = (i % step === 0 || i === list.length - 1) ? 'Y' + y.year : '';
        labels.appendChild(lab);
      });
    }

    function updateStudio() {
      var P = +sAmt.value, R = +sRate.value, Y = +sTen.value, X = +sPre.value;
      var base = amortise(P, R, Y, 0);
      var withX = X > 0 ? amortise(P, R, Y, X) : base;
      var total = base.emi * base.months, interest = total - P;
      var iPct = total > 0 ? interest / total * 100 : 0, pPct = 100 - iPct;
      var aI = C * iPct / 100, aP = C * pPct / 100;

      LKB.$('arcI').setAttribute('stroke-dasharray', aI + ' ' + C);
      var ap = LKB.$('arcP');
      ap.setAttribute('stroke-dasharray', aP + ' ' + C);
      ap.setAttribute('stroke-dashoffset', -aI);

      LKB.$('gaugePct').textContent = Math.round(iPct) + '%';
      LKB.$('lgP').textContent = compact(P);
      LKB.$('lgI').textContent = compact(interest);
      LKB.$('lgT').textContent = compact(total);
      LKB.$('barP').style.width = pPct + '%';
      LKB.$('barI').style.width = iPct + '%';

      LKB.$('emiVal').textContent = fmt(base.emi);
      LKB.$('emiCap').textContent =
        'for ' + Y + (Y === 1 ? ' year' : ' years') + ' at ' + R.toFixed(2) + '% p.a. · ' + base.months + ' monthly instalments';
      LKB.$('tagN').textContent = base.months;
      LKB.$('tagFI').textContent = compact(base.firstYearInt);

      var monthsSaved = base.months - withX.months;
      LKB.$('tagSave').textContent =
        X > 0 ? (Math.floor(monthsSaved / 12) + 'y ' + (monthsSaved % 12) + 'm') : '—';

      LKB.$('sAmtV').textContent = money(P);
      LKB.$('sRateV').textContent = R.toFixed(2) + '% p.a.';
      LKB.$('sTenV').textContent = Y + (Y === 1 ? ' Year' : ' Years');
      LKB.$('sPreV').textContent = money(X) + ' / mo';

      renderAmort(X > 0 ? withX : base, P);

      var first5 = base.yearly.slice(0, 5).reduce(function (a, b) { return a + b.int; }, 0);
      var share = interest > 0 ? Math.round(first5 / interest * 100) : 0;
      LKB.$('insightText').innerHTML = X > 0
        ? 'Adding <b>' + money(X) + '</b> every month cuts your tenure by <b>' + monthsSaved +
          ' months</b> and saves roughly <b>' + compact(base.totalInterest - withX.totalInterest) +
          '</b> in interest. That is real money, redirected to you.'
        : 'In the first five years you\'ll pay <b>' + compact(first5) + '</b> in interest — that\'s <b>' +
          share + '%</b> of your entire interest outgo. Even a small prepayment now reshapes the whole curve.';
    }

    [sAmt, sRate, sTen, sPre].forEach(function (el) { el.addEventListener('input', updateStudio); });
    LKB.$('loanChips').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      all('.chip', this).forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      sAmt.value = chip.getAttribute('data-amt');
      sRate.value = chip.getAttribute('data-rate');
      sTen.value = chip.getAttribute('data-ten');
      updateStudio();
    });
    updateStudio();
  })();

  /* ── 4h. TOOLS: prepayment planner ── */
  (function () {
    var pAmt = LKB.$('pAmt');
    if (!pAmt) return;
    var pRate = LKB.$('pRate'), pRem = LKB.$('pRem'),
        pExtra = LKB.$('pExtra'), pLump = LKB.$('pLump');

    function render() {
      var full = +pAmt.value, P = Math.max(full - (+pLump.value), 1),
          R = +pRate.value, Y = +pRem.value, X = +pExtra.value;

      var orig = amortise(full, R, Y, 0);
      var extra = amortise(P, R, Y, X);
      var saved = Math.max(orig.totalInterest - extra.totalInterest, 0);
      var monthsSaved = Math.max(orig.months - extra.months, 0);

      LKB.$('pSave').textContent = fmt(saved);
      LKB.$('pCaption').innerHTML =
        'and close your loan <b>' + Math.floor(monthsSaved / 12) + ' years ' + (monthsSaved % 12) + ' months early</b>.';
      LKB.$('pNowT').textContent = compact(orig.totalInterest) + ' interest';
      LKB.$('pNewT').textContent = compact(extra.totalInterest) + ' interest';
      LKB.$('pNowBar').style.width = '100%';
      LKB.$('pNewBar').style.width =
        Math.max((extra.totalInterest / Math.max(orig.totalInterest, 1)) * 100, 12) + '%';
      LKB.$('pOrig').textContent = orig.months + ' months';
      LKB.$('pNewM').textContent = extra.months + ' months';
      LKB.$('pSavedTxt').textContent = compact(saved);

      LKB.$('pAmtV').textContent = money(full);
      LKB.$('pRateV').textContent = R.toFixed(2) + '%';
      LKB.$('pRemV').textContent = Y + (Y === 1 ? ' Year' : ' Years');
      LKB.$('pExtraV').textContent = money(X) + ' / mo';
      LKB.$('pLumpV').textContent = money(+pLump.value);
    }

    [pAmt, pRate, pRem, pExtra, pLump].forEach(function (el) { el.addEventListener('input', render); });
    render();
  })();

  /* ── 4i. TOOLS: affordability estimator ── */
  (function () {
    var aInc = LKB.$('aInc');
    if (!aInc) return;
    var aOut = LKB.$('aOut'), aRate = LKB.$('aRate'), aTen = LKB.$('aTen');

    function render() {
      var inc = +aInc.value, out = +aOut.value, R = +aRate.value, Y = +aTen.value;
      var safe = inc * 0.45;
      var avail = Math.max(safe - out, 0);
      var r = R / 12 / 100, n = Y * 12;
      var loan = r > 0 ? avail * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : avail * n;

      LKB.$('aLoan').textContent = fmt(loan);
      LKB.$('aCap').textContent =
        'based on a 45% debt-to-income ceiling at ' + R.toFixed(2) + '% over ' + Y + ' years';
      LKB.$('aR1').textContent = money(inc);
      LKB.$('aR2').textContent = money(safe);
      LKB.$('aR3').textContent = '− ' + money(out);
      LKB.$('aR4').textContent = money(avail);
      LKB.$('aInsight').innerHTML = avail <= 0
        ? 'Your existing EMIs already exceed 45% of income. Most lenders will decline new credit until this ratio improves — clearing an existing obligation first is usually the fastest route.'
        : 'At this level you could comfortably service roughly <b style="color:var(--gold-300)">' + compact(loan) +
          '</b>. Keep a buffer below this — a 5–10% margin absorbs rate resets and income changes without stress.';

      LKB.$('aIncV').textContent = money(inc);
      LKB.$('aOutV').textContent = money(out);
      LKB.$('aRateV').textContent = R.toFixed(2) + '%';
      LKB.$('aTenV').textContent = Y + (Y === 1 ? ' Year' : ' Years');
    }

    [aInc, aOut, aRate, aTen].forEach(function (el) { el.addEventListener('input', render); });
    render();
  })();

  onScroll();
})();
