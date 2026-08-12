import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HOTELS_DATA } from '../data/hotels';
import { Hotel } from '../types/hotel';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { ContactForm } from '../components/ContactForm';
import { useScrollReveal } from '../components/ScrollReveal';

export const HotelDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; src: string; alt: string }>({
    isOpen: false,
    src: '',
    alt: '',
  });

  useScrollReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setLoading(true);
    setError(null);

    const foundHotel = HOTELS_DATA.find((h) => h.slug === slug);

    // Simulate brief state transition for smooth rendering
    const timer = setTimeout(() => {
      if (foundHotel) {
        setHotel(foundHotel);
      } else {
        setError(`Hotel property '${slug}' not found.`);
      }
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [slug]);

  const openLightbox = (src: string, alt: string) => {
    setLightboxState({ isOpen: true, src, alt });
  };

  const closeLightbox = () => {
    setLightboxState({ isOpen: false, src: '', alt: '' });
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <i
          className="fa-solid fa-spinner fa-spin"
          style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }}
        ></i>
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>Loading Property Details...</h2>
      </div>
    );
  }

  // Error state
  if (error || !hotel) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          textAlign: 'center',
        }}
      >
        <i
          className="fa-solid fa-hotel"
          style={{ fontSize: '3.5rem', color: 'var(--color-gold)', marginBottom: '1.5rem' }}
        ></i>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Property Not Found</h1>
        <p style={{ maxWidth: '500px', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          {error || "The requested property page does not exist or has been moved."}
        </p>
        <Link to="/" className="btn btn-gold">
          Return to Home Page
        </Link>
      </div>
    );
  }

  return (
    <main>
      {/* HERO BANNER */}
      <section className="page-hero" aria-label={`${hotel.name} hero`}>
        <img src={hotel.heroImage} alt={hotel.name} className="page-hero__img" loading="eager" />
        <div className="page-hero__overlay"></div>
        <div className="page-hero__content">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb__item">
                Home
              </Link>
              <span className="breadcrumb__sep">
                <i className="fa-solid fa-chevron-right"></i>
              </span>
              <Link to="/#hotels" className="breadcrumb__item">
                Hotels
              </Link>
              <span className="breadcrumb__sep">
                <i className="fa-solid fa-chevron-right"></i>
              </span>
              <span className="breadcrumb__item breadcrumb__item--current">{hotel.name}</span>
            </nav>
            <p className="page-hero__property-type">
              <i className={hotel.propertyTypeIcon}></i> {hotel.propertyType}
            </p>
            <h1 className="page-hero__title">{hotel.name}</h1>
            <div className="page-hero__location">
              <div className="page-hero__location-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <span className="page-hero__location-text">{hotel.address}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THE HOTEL */}
      <section className="hotel-section hotel-about" id="about-hotel" aria-labelledby="hotel-about-heading">
        <div className="container">
          {/* PROPERTY ADDRESS SPOTLIGHT (CENTER OF ATTRACTION) */}
          <div className="property-address-spotlight reveal">
            <div className="spotlight-icon-wrap">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="spotlight-content">
              <span className="spotlight-label">
                <i className="fa-solid fa-compass"></i> PROPERTY LOCATION &amp; ADDRESS
              </span>
              <h3 className="spotlight-address">{hotel.address}</h3>
              {hotel.landmark && (
                <p className="spotlight-landmark">
                  <i className="fa-solid fa-map-pin"></i> {hotel.landmark}
                </p>
              )}
            </div>
            <div className="spotlight-action">
              <a href="#hotel-location" className="btn btn-gold btn-sm">
                <i className="fa-solid fa-map-location-dot"></i> View Map &amp; Directions
              </a>
            </div>
          </div>

          <div className="hotel-about__grid">
            <div className="reveal from-right">
              <img src={hotel.aboutImage} alt={hotel.name} className="hotel-about__img" loading="lazy" />
            </div>
            <div className="reveal from-left">
              <p className="section-label">About The Property</p>
              <h2 id="hotel-about-heading">{hotel.tagline}</h2>
              <div className="divider"></div>
              {hotel.fullDescription.map((pText, i) => (
                <p key={i}>{pText}</p>
              ))}
              <div className="hotel-about__highlights">
                {hotel.highlights.map((hl, i) => (
                  <div key={i} className="hotel-about__highlight">
                    <i className="fa-solid fa-check-circle"></i> {hl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOMMODATION */}
      <section className="hotel-section hotel-section--bg-white" id="accommodation" aria-labelledby="rooms-heading">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">Accommodation</p>
            <h2 id="rooms-heading">Rooms &amp; Suites</h2>
            <div className="divider divider--center"></div>
            <p>{hotel.name} offers carefully designed rooms ensuring absolute privacy, comfort, and magnificent views.</p>
          </div>
          <div className="rooms-grid">
            {hotel.rooms.map((room, idx) => (
              <div key={room.id} className={`room-card reveal reveal-delay-${idx + 1}`}>
                <div className="room-card__img-wrap">
                  <img src={room.image} alt={room.name} className="room-card__img" loading="lazy" />
                </div>
                <div className="room-card__body">
                  {room.countBadge && (
                    <span
                      className="room-card__badge"
                      style={{
                        background: 'var(--color-gold)',
                        color: '#000',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-block',
                        marginBottom: '8px',
                      }}
                    >
                      {room.countBadge}
                    </span>
                  )}
                  <h3 className="room-card__name">{room.name}</h3>
                  <p className="room-card__desc">{room.description}</p>
                  <div className="room-card__amenities">
                    {room.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="room-tag">
                        <i className="fa-solid fa-check"></i> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="room-card__footer">
                    <a href="#hotel-contact" className="btn btn-gold btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      Enquire for Booking
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="hotel-section" id="amenities" aria-labelledby="amenities-heading">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">Facilities</p>
            <h2 id="amenities-heading">Property Amenities &amp; Services</h2>
            <div className="divider divider--center"></div>
            <p>Designed for complete comfort and relaxation during your stay at {hotel.name}.</p>
          </div>
          <div className="features-grid">
            {hotel.amenities.map((am, idx) => (
              <div key={idx} className={`feature-card reveal reveal-delay-${(idx % 4) + 1}`}>
                <div className="feature-card__icon">
                  <i className={am.icon}></i>
                </div>
                <h4>{am.title}</h4>
                <p>{am.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {hotel.gallery && hotel.gallery.length > 0 && (
        <section className="gallery" id="hotel-gallery" aria-labelledby="gallery-heading">
          <div className="container">
            <div className="section-header reveal">
              <p className="section-label" style={{ color: 'var(--color-gold)', justifyContent: 'center' }}>
                Gallery
              </p>
              <h2 id="gallery-heading" style={{ color: '#fff' }}>
                Photos of {hotel.name}
              </h2>
              <div className="divider divider--center"></div>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Explore the beauty and architecture of our property.</p>
            </div>

            <div className="gallery-masonry">
              {hotel.gallery.map((gImg) => (
                <div
                  key={gImg.id}
                  className="gallery-item"
                  onClick={() => openLightbox(gImg.url, gImg.alt)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={gImg.url} alt={gImg.alt} loading="lazy" />
                  <div className="gallery-item__overlay">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCATION & CONTACT */}
      <section className="hotel-section hotel-section--bg-white" id="hotel-location" aria-labelledby="location-heading">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">Location &amp; Contact</p>
            <h2 id="location-heading">Find &amp; Reach Us</h2>
            <div className="divider divider--center"></div>
            <p>Get in touch with our team for reservations and directions to {hotel.name}.</p>
          </div>

          <div className="contact__grid">
            {/* Map & Info */}
            <div className="contact__info reveal">
              <h3>{hotel.name}</h3>
              <p style={{ marginBottom: '1.5rem' }}>{hotel.address}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="contact__detail">
                  <div className="contact__detail-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="contact__detail-text">
                    <strong>Phone</strong>
                    <span>
                      <a href={`tel:${hotel.phone}`} style={{ color: 'inherit' }}>
                        {hotel.phone}
                      </a>
                    </span>
                  </div>
                </div>
                <div className="contact__detail">
                  <div className="contact__detail-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="contact__detail-text">
                    <strong>Email</strong>
                    <span>
                      <a href={`mailto:${hotel.email}`} style={{ color: 'inherit' }}>
                        {hotel.email}
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              <div className="contact__map">
                <iframe
                  src={hotel.mapEmbedUrl}
                  title={`${hotel.name} Map`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ height: '300px', width: '100%', border: 0, borderRadius: 'var(--radius-lg)' }}
                ></iframe>
              </div>
            </div>

            {/* Form */}
            <div className="contact__form-card reveal" id="hotel-contact">
              <h3>Send Property Enquiry</h3>
              <ContactForm defaultProperty={`${hotel.name}, ${hotel.city}`} isHotelForm={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <GalleryLightbox
        isOpen={lightboxState.isOpen}
        imageSrc={lightboxState.src}
        imageAlt={lightboxState.alt}
        onClose={closeLightbox}
      />
    </main>
  );
};
