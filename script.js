const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const carousel = document.querySelector('.projects-carousel');

if (carousel) {
  const viewport = carousel.querySelector('.carousel-viewport');
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.project-card')];
  const dots = carousel.querySelector('.carousel-dots');
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer;

  const slidesPerView = () => window.matchMedia('(max-width: 800px)').matches ? 1 : 2;
  const maxIndex = () => Math.max(0, slides.length - slidesPerView());

  const renderDots = () => {
    dots.replaceChildren(...Array.from({ length: maxIndex() + 1 }, (_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${index === current ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `Mostrar projetos a partir do ${index + 1}`);
      dot.setAttribute('aria-current', index === current ? 'true' : 'false');
      dot.addEventListener('click', () => {
        goTo(index);
        restart();
      });
      return dot;
    }));
  };

  const goTo = (index) => {
    const maximum = maxIndex();
    current = ((index % (maximum + 1)) + (maximum + 1)) % (maximum + 1);
    track.style.transform = `translate3d(-${slides[current].offsetLeft}px, 0, 0)`;
    renderDots();
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
  };

  const start = () => {
    if (reducedMotion || maxIndex() === 0 || timer) return;
    timer = window.setInterval(() => goTo(current + 1), 5000);
  };

  const restart = () => {
    stop();
    start();
  };

  previous.addEventListener('click', () => { goTo(current - 1); restart(); });
  next.addEventListener('click', () => { goTo(current + 1); restart(); });
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', () => window.setTimeout(start, 0));
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous.click(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next.click(); }
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  window.addEventListener('resize', () => {
    current = Math.min(current, maxIndex());
    goTo(current);
  });

  goTo(0);
  start();
}
