/* ============================================================
   NAMO HOTEL & TRAVEL — Hotel Page JS
   Scroll Reveal | Mini Testimonial Slider | Tab-like utilities
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     HOTEL PAGE TESTIMONIAL SLIDER (reuse same pattern as main)
  ---------------------------------------------------------- */
  const hotelTestimonialSlider = document.getElementById('hotel-testimonial-slider');

  if (hotelTestimonialSlider) {
    const track = hotelTestimonialSlider.querySelector('.testimonial-track');
    const cards = hotelTestimonialSlider.querySelectorAll('.testimonial-card');
    const dots = hotelTestimonialSlider.querySelectorAll('.testimonial-dot');
    const prevBtn = hotelTestimonialSlider.querySelector('.testimonial-btn--prev');
    const nextBtn = hotelTestimonialSlider.querySelector('.testimonial-btn--next');

    let current = 0;
    let auto;

    const goTo = (index) => {
      if (dots[current]) dots[current].classList.remove('active');
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dots[current]) dots[current].classList.add('active');
    };

    const start = () => { auto = setInterval(() => goTo(current + 1), 5500); };
    const stop = () => clearInterval(auto);

    if (cards.length > 0) {
      if (dots[0]) dots[0].classList.add('active');
      start();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stop(); goTo(current + 1); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stop(); goTo(i); start(); }));

    hotelTestimonialSlider.addEventListener('mouseenter', stop);
    hotelTestimonialSlider.addEventListener('mouseleave', start);
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL (runs on hotel pages too)
     (IntersectionObserver already in main.js — recheck in case
      hotel.js loads standalone)
  ---------------------------------------------------------- */
  if (!window._namo_reveal_init) {
    window._namo_reveal_init = true;

    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length > 0) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
      );

      revealEls.forEach(el => observer.observe(el));
    }
  }

  /* ----------------------------------------------------------
     HOTEL CONTACT FORM
  ---------------------------------------------------------- */
  const hotelForm = document.querySelector('.js-hotel-form');

  if (hotelForm) {
    hotelForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      hotelForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#c0392b';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      const submitBtn = hotelForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Enquiry Sent!';
        submitBtn.style.background = '#27ae60';
        submitBtn.style.borderColor = '#27ae60';
        setTimeout(() => {
          submitBtn.textContent = 'Send Enquiry';
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          hotelForm.reset();
        }, 3000);
      }
    });
  }

})();
