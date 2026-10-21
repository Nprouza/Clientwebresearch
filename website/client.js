document.addEventListener('DOMContentLoaded', () => {
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    const slides = Array.from(carouselTrack.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsNav = document.getElementById('carouselDots');

    let currentIndex = 0;
    let autoPlayTimer = null;

    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
      dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    });

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4500);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    let startX = 0;
    let isDragging = false;

    const carousel = document.getElementById('carousel');

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (diffX > 50) {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
      } else if (diffX < -50) {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
      }
      isDragging = false;
    }, { passive: true });

    startAutoPlay();
  }

});
