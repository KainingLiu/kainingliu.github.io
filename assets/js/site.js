// Shared behaviour for every page: language toggle, BibTeX boxes,
// nav highlighting on the homepage, and click-to-load embeds.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('lang-toggle');
  var titles = { 'zh-CN': root.getAttribute('data-title-zh'), 'en': root.getAttribute('data-title-en') };

  function setLang(l, save) {
    root.lang = l;
    if (titles[l]) document.title = titles[l];
    if (btn) btn.setAttribute('aria-label', l === 'en' ? '切换到中文' : 'Switch to English');
    if (!save) return;
    var short = l === 'en' ? 'en' : 'zh';
    try { localStorage.setItem('lang', short); } catch (e) {}
    try {
      var u = new URL(location.href);
      if (u.searchParams.has('lang')) { u.searchParams.set('lang', short); history.replaceState(null, '', u); }
    } catch (e) {}
  }
  setLang(root.lang === 'en' ? 'en' : 'zh-CN', false);
  if (btn) btn.addEventListener('click', function () { setLang(root.lang === 'en' ? 'zh-CN' : 'en', true); });

  // BibTeX: show/hide and copy.
  document.querySelectorAll('[data-bib]').forEach(function (b) {
    var box = document.getElementById(b.getAttribute('data-bib'));
    b.addEventListener('click', function () {
      box.hidden = !box.hidden;
      b.setAttribute('aria-expanded', String(!box.hidden));
    });
    var copy = box.querySelector('.copy');
    var label = copy.innerHTML;
    copy.addEventListener('click', function () {
      var text = box.querySelector('pre').textContent;
      var done = function () {
        copy.innerHTML = '<span lang="zh-CN">已复制</span><span lang="en">Copied</span>';
        setTimeout(function () { copy.innerHTML = label; }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var r = document.createRange();
        r.selectNodeContents(box.querySelector('pre'));
        var s = getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand('copy'); done(); } catch (e) {}
        s.removeAllRanges();
      }
    });
  });

  // Click-to-load embeds (e.g. a heavy 3D viewer): swap the poster for an iframe.
  document.querySelectorAll('[data-embed]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('.embed');
      var f = document.createElement('iframe');
      f.src = b.getAttribute('data-embed');
      f.title = b.getAttribute('data-embed-title') || '';
      f.allow = 'fullscreen';
      f.loading = 'lazy';
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('loaded');
    });
  });

  // Highlight the nav link of the section in view (only on pages whose nav opts in).
  var spy = document.querySelector('.nav-links[data-spy]');
  if (!spy) return;
  var navLinks = [].slice.call(spy.querySelectorAll('a[href^="#"]'));
  var targets = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  navLinks = navLinks.filter(function (a, i) { return targets[i]; });
  targets = targets.filter(Boolean);
  if (!targets.length) return;
  var ticking = false;
  function markActive() {
    ticking = false;
    var cur = 0, doc = document.documentElement;
    if (innerHeight + scrollY >= doc.scrollHeight - 4) cur = targets.length - 1;
    else targets.forEach(function (t, i) { if (t.getBoundingClientRect().top <= innerHeight * 0.35) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(markActive); } }, { passive: true });
  addEventListener('resize', markActive);
  markActive();
})();
