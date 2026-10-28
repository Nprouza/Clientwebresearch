document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(bookingForm);
      const name = formData.get('name')?.toString().trim() || 'Not provided';
      const email = formData.get('email')?.toString().trim() || 'Not provided';
      const phone = formData.get('phone')?.toString().trim() || 'Not provided';
      const service = formData.get('service')?.toString().trim() || 'Not provided';
      const date = formData.get('date')?.toString().trim() || 'Not provided';
      const notes = formData.get('notes')?.toString().trim() || 'No additional notes';

      const message = [
        'Booking request',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        `Preferred date: ${date}`,
        `Notes: ${notes}`
      ].join('\n');

      const smsLink = `sms:+13308129413?body=${encodeURIComponent(message)}`;
      window.location.href = smsLink;
    });
  }

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

  const reviewsSection = document.getElementById('reviews');
  if (reviewsSection) {
    const reviewsTrack = reviewsSection.querySelector('.reviews-track');
    const reviewSlides = Array.from(reviewsTrack?.children || []);
    const reviewsDots = reviewsSection.querySelector('.reviews-dots');
    const previousReviewButton = reviewsSection.querySelector('.reviews-control.prev');
    const nextReviewButton = reviewsSection.querySelector('.reviews-control.next');
    const googleReviewsUrl = reviewsSection.dataset.googleReviewsUrl?.trim();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentReviewIndex = 0;
    let reviewsTimer = null;

    reviewSlides.forEach((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${index + 1} of ${reviewSlides.length}`);

      const reviewLink = slide;
      if (googleReviewsUrl) {
        reviewLink.href = googleReviewsUrl;
        reviewLink.removeAttribute('aria-disabled');
        reviewLink.removeAttribute('tabindex');
        reviewLink.target = '_blank';
        reviewLink.rel = 'noopener noreferrer';
      } else {
        reviewLink.tabIndex = -1;
        reviewLink.addEventListener('click', (event) => event.preventDefault());
      }

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'reviews-dot';
      dot.setAttribute('aria-label', `Show review ${index + 1}`);
      dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
      dot.classList.toggle('active', index === 0);
      dot.addEventListener('click', () => {
        goToReview(index);
        resetReviewsTimer();
      });
      reviewsDots?.appendChild(dot);
    });

    const reviewDotButtons = Array.from(reviewsDots?.children || []);

    function goToReview(index) {
      if (!reviewSlides.length || !reviewsTrack) return;
      currentReviewIndex = (index + reviewSlides.length) % reviewSlides.length;
      reviewsTrack.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
      reviewDotButtons.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentReviewIndex);
        dot.setAttribute('aria-current', dotIndex === currentReviewIndex ? 'true' : 'false');
      });
    }

    function stopReviewsTimer() {
      clearInterval(reviewsTimer);
      reviewsTimer = null;
    }

    function startReviewsTimer() {
      if (
        reducedMotion ||
        reviewSlides.length < 2 ||
        document.hidden ||
        reviewsSection.matches(':hover') ||
        reviewsSection.contains(document.activeElement)
      ) return;
      stopReviewsTimer();
      reviewsTimer = setInterval(() => goToReview(currentReviewIndex + 1), 5000);
    }

    function resetReviewsTimer() {
      stopReviewsTimer();
      startReviewsTimer();
    }

    previousReviewButton?.addEventListener('click', () => {
      goToReview(currentReviewIndex - 1);
      resetReviewsTimer();
    });
    nextReviewButton?.addEventListener('click', () => {
      goToReview(currentReviewIndex + 1);
      resetReviewsTimer();
    });

    reviewsSection.addEventListener('mouseenter', stopReviewsTimer);
    reviewsSection.addEventListener('mouseleave', startReviewsTimer);
    reviewsSection.addEventListener('focusin', stopReviewsTimer);
    reviewsSection.addEventListener('focusout', (event) => {
      if (!reviewsSection.contains(event.relatedTarget)) startReviewsTimer();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopReviewsTimer();
      } else {
        startReviewsTimer();
      }
    });

    startReviewsTimer();
  }

  const comparisonSliders = document.querySelectorAll('.comparison-slider');

  comparisonSliders.forEach((slider) => {
    const beforeLayer = slider.querySelector('.before-layer');
    const afterLayer = slider.querySelector('.after-layer');
    const handle = slider.querySelector('.comparison-handle');

    if (!beforeLayer || !afterLayer || !handle) return;

    let isDragging = false;

    function updateSlider(clientX) {
      const rect = slider.getBoundingClientRect();
      const clampedX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const percentage = (clampedX / rect.width) * 100;

      beforeLayer.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      afterLayer.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      handle.style.left = `${percentage}%`;
    }

    slider.addEventListener('pointerdown', (event) => {
      isDragging = true;
      slider.setPointerCapture?.(event.pointerId);
      updateSlider(event.clientX);
    });

    slider.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      updateSlider(event.clientX);
    });

    slider.addEventListener('pointerup', () => {
      isDragging = false;
    });

    slider.addEventListener('pointerleave', () => {
      isDragging = false;
    });

    slider.addEventListener('pointercancel', () => {
      isDragging = false;
    });

    const rect = slider.getBoundingClientRect();
    updateSlider(rect.left + rect.width * 0.5);
  });
});
