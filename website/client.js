document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const dotsNav = document.getElementById('carouselDots');

  let currentIndex = 0;
  let autoPlayTimer = null;

  // Create Navigation Dots dynamically
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

  // Move track to slide index
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active dot
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Next / Previous Click Handlers
  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoPlay();
  });

  // Auto-Play Timer (Advances every 4.5 seconds)
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  // Touch / Swipe Support for Mobile Devices
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
      goToSlide(currentIndex + 1); // Swipe left -> next
      resetAutoPlay();
    } else if (diffX < -50) {
      goToSlide(currentIndex - 1); // Swipe right -> prev
      resetAutoPlay();
    }
    isDragging = false;
  }, { passive: true });

  // Start auto rotation on load
  startAutoPlay();
});
