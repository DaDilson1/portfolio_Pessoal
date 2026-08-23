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

// Carrossel de Projetos
class ProjectsCarousel {
  constructor() {
    this.track = document.querySelector('.carousel-track');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.dotsContainer = document.querySelector('.carousel-dots');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.currentIndex = 0;
    this.slidesPerView = 2;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    this.isTransitioning = false;

    if (window.innerWidth <= 800) {
      this.slidesPerView = 1;
    }

    this.init();
  }

  init() {
    this.createDots();
    this.updateCarousel();
    this.startAutoPlay();

    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());

    window.addEventListener('resize', () => {
      const newSlidesPerView = window.innerWidth <= 800 ? 1 : 2;
      if (newSlidesPerView !== this.slidesPerView) {
        this.slidesPerView = newSlidesPerView;
        this.currentIndex = 0;
        this.updateCarousel();
        this.updateDots();
        this.stopAutoPlay();
        this.startAutoPlay();
      }
    });
  }

  createDots() {
    const totalDots = this.totalSlides - this.slidesPerView + 1;
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('span');
      dot.dataset.index = i;
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
    this.updateDots();
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll('span');
    const maxIndex = this.totalSlides - this.slidesPerView;
    const activeIndex = Math.min(this.currentIndex, maxIndex);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  updateCarousel() {
    const maxIndex = this.totalSlides - this.slidesPerView;
    const index = Math.min(this.currentIndex, maxIndex);
    const slideWidth = 100 / this.slidesPerView;
    this.track.style.transform = `translateX(-${index * slideWidth}%)`;
  }

  goToSlide(index) {
    if (this.isTransitioning) return;
    const maxIndex = this.totalSlides - this.slidesPerView;
    this.currentIndex = Math.min(Math.max(index, 0), maxIndex);
    this.updateCarousel();
    this.updateDots();
    this.resetAutoPlay();
  }

  prevSlide() {
    const maxIndex = this.totalSlides - this.slidesPerView;
    if (this.currentIndex === 0) {
      this.goToSlide(maxIndex);
    } else {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  nextSlide() {
    const maxIndex = this.totalSlides - this.slidesPerView;
    if (this.currentIndex >= maxIndex) {
      this.goToSlide(0);
    } else {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    if (this.totalSlides <= this.slidesPerView) return;
    this.autoPlayInterval = setInterval(() => {
      if (!this.isTransitioning) {
        this.nextSlide();
      }
    }, 4000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    if (this.totalSlides <= this.slidesPerView) return;
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// Inicializar o carrossel quando a página carregar
if (document.querySelector('.carousel-track')) {
  document.addEventListener('DOMContentLoaded', () => {
    const carousel = new ProjectsCarousel();
  });
}