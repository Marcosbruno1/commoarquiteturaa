(() => {
  const hero = document.querySelector('.hero-scroll');
  const frames = [...document.querySelectorAll('.hero-frame')];
  const ambient = document.querySelector('.mobile-ambient');
  const finalCopy = document.querySelector('.hero-final-copy');
  const scrollHint = document.querySelector('.scroll-hint');
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const paths = frames.map(f => f.getAttribute('src'));

  paths.slice(1).forEach(src => { const img = new Image(); img.src = src; });

  function setAmbient(i){ if (ambient) ambient.style.setProperty('--ambient', `url("${paths[i]}")`); }
  setAmbient(0);

  function renderHero(){
    const rect = hero.getBoundingClientRect();
    const total = Math.max(hero.offsetHeight - innerHeight, 1);
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    const segment = Math.min(3, Math.floor(progress * 4));
    const local = progress * 4 - segment;

    frames.forEach((frame, i) => {
      let opacity = 0;
      if (i === segment) opacity = 1 - Math.max(0, local - .62) / .38;
      if (i === segment + 1) opacity = Math.max(0, local - .62) / .38;
      if (segment === 3 && i === 3) opacity = 1;
      frame.style.opacity = Math.max(0, Math.min(1, opacity));
      const scale = 1 + Math.min(.018, (local * .012));
      frame.style.transform = `scale(${scale})`;
    });

    const active = progress < .25 ? 0 : progress < .5 ? 1 : progress < .75 ? 2 : 3;
    setAmbient(active);

    const copyStart = .88;
    const copyProgress = Math.max(0, Math.min(1, (progress - copyStart) / .09));
    finalCopy.style.opacity = copyProgress;
    finalCopy.style.transform = `translateY(${28 * (1 - copyProgress)}px)`;
    finalCopy.classList.toggle('visible', copyProgress > .98);
    scrollHint.classList.toggle('hide', progress > .16);

    header.classList.toggle('scrolled', rect.bottom <= innerHeight * .15);
  }

  addEventListener('scroll', renderHero, {passive:true});
  addEventListener('resize', renderHero);
  renderHero();

  const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('in')), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  function closeMenu(){ document.body.classList.remove('menu-open'); mobileMenu.classList.remove('open'); mobileMenu.setAttribute('aria-hidden','true'); menuButton.setAttribute('aria-expanded','false'); }
  menuButton.addEventListener('click', () => {
    const opening = !mobileMenu.classList.contains('open');
    document.body.classList.toggle('menu-open', opening);
    mobileMenu.classList.toggle('open', opening);
    mobileMenu.setAttribute('aria-hidden', String(!opening));
    menuButton.setAttribute('aria-expanded', String(opening));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();