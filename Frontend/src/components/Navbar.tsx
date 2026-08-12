import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HOTELS_DATA } from '../data/hotels';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    document.body.style.overflow = '';
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    closeMobileMenu();
    if (isHomePage) {
      e.preventDefault();
      const lenis = (window as Window & { __lenis?: { scrollTo: (t: string | HTMLElement | number, o?: object) => void } }).__lenis;
      if (targetId === 'home') {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -80 });
        else el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      navigate(`/#${targetId}`);
    }
  };

  return (
    <>
      <nav
        className={`nav ${isScrolled || !isHomePage ? 'nav--scrolled' : 'nav--transparent'}`}
        id="main-nav"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="container">
          <div className="nav__inner">
            {/* Logo */}
            <Link
              to="/"
              className="nav__logo"
              aria-label="NAMO Hotel & Travel Home"
              onClick={closeMobileMenu}
            >
              <img
                src="/images/logo.jpg"
                alt="NAMO Hotel & Travel Logo"
                className="nav__logo-img"
              />
            </Link>

            {/* Desktop Links */}
            <ul className="nav__links" role="list">
              <li>
                <Link
                  to="/"
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, 'home')}
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#about"
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, 'about')}
                >
                  About
                </a>
              </li>

              {/* Hotels Dropdown */}
              <li className="nav__dropdown-parent">
                <a
                  href="#hotels"
                  className="nav__link nav__dropdown-trigger"
                  onClick={(e) => handleNavClick(e, 'hotels')}
                  aria-haspopup="true"
                >
                  Hotels
                </a>
                <div className="nav__dropdown" role="menu">
                  <div className="nav__dropdown-inner">
                    {HOTELS_DATA.map((hotel) => (
                      <Link
                        key={hotel.slug}
                        to={`/hotels/${hotel.slug}`}
                        className="nav__dropdown-link"
                        role="menuitem"
                        onClick={closeMobileMenu}
                      >
                        <span className="dropdown-icon">
                          <i className={hotel.propertyTypeIcon} />
                        </span>
                        <span>
                          <span className="dropdown-name">{hotel.name}</span>
                          <span className="dropdown-location">
                            <i className="fa-solid fa-location-dot" /> {hotel.city}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              <li>
                <a
                  href="#experiences"
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, 'experiences')}
                >
                  Experiences
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, 'events')}
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, 'contact')}
                >
                  Contact
                </a>
              </li>
            </ul>

            <div className="nav__cta">
              <a
                href="#contact"
                className="btn btn-gold btn-sm nav__book-btn"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Book Now
              </a>
            </div>

            {/* Hamburger */}
            <button
              className={`nav__hamburger ${isMobileOpen ? 'active' : ''}`}
              id="nav-hamburger"
              aria-label={isMobileOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileOpen}
              onClick={toggleMobileMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay Backdrop */}
      <div
        className={`nav__mobile-backdrop ${isMobileOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <nav
        className={`nav__mobile-drawer ${isMobileOpen ? 'open' : ''}`}
        id="nav-mobile"
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="nav__mobile-header">
          <img
            src="/images/logo.jpg"
            alt="NAMO Hotel & Travel"
            className="nav__mobile-logo"
          />
          <button
            className="nav__mobile-close"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Links */}
        <div className="nav__mobile-links">
          <Link
            to="/"
            className="nav__mobile-link"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <a
            href="#about"
            className="nav__mobile-link"
            onClick={(e) => handleNavClick(e, 'about')}
          >
            About
          </a>
          <a
            href="#hotels"
            className="nav__mobile-link"
            onClick={(e) => handleNavClick(e, 'hotels')}
          >
            Hotels
          </a>

          <div className="nav__mobile-hotels">
            <span className="nav__mobile-sublabel">Our Properties</span>
            {HOTELS_DATA.map((hotel) => (
              <Link
                key={hotel.slug}
                to={`/hotels/${hotel.slug}`}
                className="nav__mobile-sublink"
                onClick={closeMobileMenu}
              >
                <i className={hotel.propertyTypeIcon} style={{ color: 'var(--color-gold)', width: '16px' }} />
                {hotel.name}
                <span className="nav__mobile-city"> — {hotel.city}</span>
              </Link>
            ))}
          </div>

          <a
            href="#experiences"
            className="nav__mobile-link"
            onClick={(e) => handleNavClick(e, 'experiences')}
          >
            Experiences
          </a>
          <a
            href="#events"
            className="nav__mobile-link"
            onClick={(e) => handleNavClick(e, 'events')}
          >
            Events
          </a>
          <a
            href="#contact"
            className="nav__mobile-link"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Contact
          </a>
        </div>

        {/* Drawer Footer */}
        <div className="nav__mobile-footer">
          <a
            href="#contact"
            className="btn btn-gold"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Book a Stay
          </a>
          <div className="nav__mobile-contact">
            <a href="tel:+918690278979" className="nav__mobile-phone">
              <i className="fa-solid fa-phone" />
              +91 86902 78979
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};
