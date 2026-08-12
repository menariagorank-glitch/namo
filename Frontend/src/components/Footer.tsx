import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HOTELS_DATA } from '../data/hotels';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isHomePage) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      navigate(`/#${targetId}`);
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__main">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" aria-label="NAMO Hotel & Travel Home">
              <img src="/images/logo.jpg" alt="NAMO Hotel &amp; Travel Logo" className="footer__logo-img" />
            </Link>
            <p style={{ marginTop: '1rem' }}>
              A distinguished multi-property hospitality group celebrating the royal heritage, culture and natural splendour of Rajasthan, India.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://wa.me/918690278979"
                className="footer__social-link"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h5>Quick Links</h5>
            <ul className="footer__links">
              <li>
                <Link to="/" className="footer__link" onClick={(e) => handleNavClick(e, 'home')}>
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="footer__link" onClick={(e) => handleNavClick(e, 'about')}>
                  About
                </a>
              </li>
              <li>
                <a href="#hotels" className="footer__link" onClick={(e) => handleNavClick(e, 'hotels')}>
                  Hotels
                </a>
              </li>
              <li>
                <a href="#experiences" className="footer__link" onClick={(e) => handleNavClick(e, 'experiences')}>
                  Experiences
                </a>
              </li>
              <li>
                <a href="#events" className="footer__link" onClick={(e) => handleNavClick(e, 'events')}>
                  Events
                </a>
              </li>
              <li>
                <a href="#contact" className="footer__link" onClick={(e) => handleNavClick(e, 'contact')}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Hotels */}
          <div className="footer__col">
            <h5>Our Hotels</h5>
            <ul className="footer__links">
              {HOTELS_DATA.map((hotel) => (
                <li key={hotel.slug}>
                  <Link to={`/hotels/${hotel.slug}`} className="footer__link">
                    {hotel.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h5>Contact Info</h5>
            <div className="footer__contact-item">
              <i className="fa-solid fa-building"></i>
              <span>NAMO HOTEL &amp; TRAVEL</span>
            </div>
            <div className="footer__contact-item">
              <i className="fa-solid fa-location-dot"></i>
              <span>02, Surya Nagar, The Kushal Bagh Palace, Savina, Udaipur, Rajasthan</span>
            </div>
            <div className="footer__contact-item">
              <i className="fa-solid fa-phone"></i>
              <span>
                <a href="tel:+918690278979" style={{ color: 'inherit' }}>
                  +91 86902 78979
                </a>
              </span>
            </div>
            <div className="footer__contact-item">
              <i className="fa-solid fa-envelope"></i>
              <span>
                <a href="mailto:namohotelandtravel@gmail.com" style={{ color: 'inherit' }}>
                  namohotelandtravel@gmail.com
                </a>
              </span>
            </div>
            <div className="footer__contact-item">
              <i className="fa-solid fa-globe"></i>
              <span>
                <a href="http://www.namohotelsandtravel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                  www.namohotelsandtravel.com
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p className="footer__copy">&copy; 2025 NAMO HOTEL &amp; TRAVEL. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">
              Privacy Policy
            </a>
            <a href="#" className="footer__bottom-link">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
