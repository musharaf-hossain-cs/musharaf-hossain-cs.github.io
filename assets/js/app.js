
// Mobile nav toggle
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-menu]');
  if(btn){
    document.querySelector('.nav-links').classList.toggle('open');
  }
});


// Smooth anchor scrolling with header offset
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({top: y, behavior: 'smooth'});
      history.pushState(null, '', '#' + id);
    }
  });
});


// ---- Scroll Spy (highlights active nav link as you scroll) ----
(function () {
  const ACTIVE_CLASS = 'badge';
  const headerEl = document.querySelector('.nav'); // sticky header
  const headerH = () => (headerEl ? headerEl.offsetHeight : 72);

  // 👇 your actual section IDs
  const sectionIds = ['about', 'research', 'experience', 'projects', 'skills'];

  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'))
    .filter(a => sectionIds.includes(a.getAttribute('href').slice(1)));

  const linkById = new Map(
    links.map(a => [a.getAttribute('href').slice(1), a])
  );

  function setActive(id) {
    links.forEach(a => a.classList.remove(ACTIVE_CLASS));
    const l = linkById.get(id);
    if (l) l.classList.add(ACTIVE_CLASS);
  }

  function computeActiveId() {
    const y = window.scrollY + headerH() + 8;
    let current = sectionIds[0];
    for (const s of sections) {
      const top = s.getBoundingClientRect().top + window.scrollY;
      if (top <= y) current = s.id; else break;
    }
    return current;
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActive(computeActiveId());
      ticking = false;
    });
  }

  links.forEach(a => {
    a.addEventListener('click', () => setActive(a.getAttribute('href').slice(1)));
  });

  ['scroll', 'resize'].forEach(ev =>
    window.addEventListener(ev, onScroll, { passive: true })
  );

  window.addEventListener('load', () => {
    const hash = location.hash.replace('#', '');
    if (sectionIds.includes(hash)) setActive(hash);
    else setActive(computeActiveId());
  });

  window.addEventListener('hashchange', () => {
    const hash = location.hash.replace('#', '');
    if (sectionIds.includes(hash)) setActive(hash);
  });

  setActive(computeActiveId());
})();
