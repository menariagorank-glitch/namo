/* ============================================================
   NAMO HOTEL & TRAVEL — Main JS
   Navigation | Hero Slider | Scroll Reveal | Mobile Menu
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     STICKY NAV
  ---------------------------------------------------------- */
  const nav = document.getElementById('main-nav');

  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav--scrolled');
        nav.classList.remove('nav--transparent');
      } else {
        nav.classList.remove('nav--scrolled');
        nav.classList.add('nav--transparent');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on load
  }

  /* ----------------------------------------------------------
     MOBILE HAMBURGER
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     HERO SLIDER
  ---------------------------------------------------------- */
  const heroSlider = document.getElementById('hero-slider');

  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    let current = 0;
    let autoInterval;

    const goTo = (index) => {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    };

    const next = () => goTo(current + 1);

    const startAuto = () => {
      autoInterval = setInterval(next, 5500);
    };

    const stopAuto = () => clearInterval(autoInterval);

    // Initialize
    if (slides.length > 0) {
      slides[0].classList.add('active');
      if (dots[0]) dots[0].classList.add('active');
      startAuto();
    }

    // Dot clicks
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAuto();
        goTo(i);
        startAuto();
      });
    });

    // Pause on hover
    heroSlider.addEventListener('mouseenter', stopAuto);
    heroSlider.addEventListener('mouseleave', startAuto);
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     TESTIMONIAL SLIDER
  ---------------------------------------------------------- */
  const testimonialSlider = document.getElementById('testimonial-slider');

  if (testimonialSlider) {
    const track = testimonialSlider.querySelector('.testimonial-track');
    const cards = testimonialSlider.querySelectorAll('.testimonial-card');
    const tdots = testimonialSlider.querySelectorAll('.testimonial-dot');
    const prevBtn = testimonialSlider.querySelector('.testimonial-btn--prev');
    const nextBtn = testimonialSlider.querySelector('.testimonial-btn--next');

    let tcurrent = 0;
    let tautoInterval;

    const tGoTo = (index) => {
      if (tdots[tcurrent]) tdots[tcurrent].classList.remove('active');
      tcurrent = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${tcurrent * 100}%)`;
      if (tdots[tcurrent]) tdots[tcurrent].classList.add('active');
    };

    const tStartAuto = () => {
      tautoInterval = setInterval(() => tGoTo(tcurrent + 1), 6000);
    };

    const tStopAuto = () => clearInterval(tautoInterval);

    if (cards.length > 0) {
      if (tdots[0]) tdots[0].classList.add('active');
      tStartAuto();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { tStopAuto(); tGoTo(tcurrent - 1); tStartAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { tStopAuto(); tGoTo(tcurrent + 1); tStartAuto(); });

    tdots.forEach((dot, i) => {
      dot.addEventListener('click', () => { tStopAuto(); tGoTo(i); tStartAuto(); });
    });

    testimonialSlider.addEventListener('mouseenter', tStopAuto);
    testimonialSlider.addEventListener('mouseleave', tStartAuto);
  }

  /* ----------------------------------------------------------
     BACK TO TOP BUTTON
  ---------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     CONTACT FORM
  ---------------------------------------------------------- */
  const contactForms = document.querySelectorAll('.js-contact-form');

  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#c0392b';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Send Enquiry';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);
      const payload = {
        name: (formData.get('name') || '').toString().trim(),
        phone: (formData.get('phone') || '').toString().trim(),
        email: (formData.get('email') || '').toString().trim(),
        hotel: (formData.get('property') || '').toString().trim(),
        message: (formData.get('message') || '').toString().trim(),
        source: 'Hotel Website',
      };

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/enquiry';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success !== false) {
          if (submitBtn) {
            submitBtn.textContent = 'Enquiry Sent!';
            submitBtn.style.background = '#27ae60';
            submitBtn.style.borderColor = '#27ae60';
          }
          form.reset();

          setTimeout(() => {
            if (submitBtn) {
              submitBtn.textContent = originalText;
              submitBtn.style.background = '';
              submitBtn.style.borderColor = '';
              submitBtn.disabled = false;
            }
          }, 4000);
        } else {
          alert(data.message || 'Unable to submit enquiry. Please try again.');
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }
        }
      } catch {
        alert('Unable to connect to server. Please check your connection and try again.');
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  });


  /* ----------------------------------------------------------
     SMOOTH SECTION TABS / ACTIVE NAV HIGHLIGHT
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('nav__link--active'));
            const id = entry.target.id;
            const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('nav__link--active');
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach(s => sectionObserver.observe(s));
  }

})();
