import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AppleStoryExperience } from '../components/AppleStoryExperience';
import { ContactForm } from '../components/ContactForm';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { InteractiveEarth } from '../components/experience/InteractiveEarth';
import { HOTELS_DATA, EXPERIENCES_DATA, DESTINATIONS_DATA } from '../data/hotels';

gsap.registerPlugin(ScrollTrigger);

type LenisWindow = Window & { __lenis?: { scrollTo: (target: string | HTMLElement | number, options?: object) => void } };

const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80', alt: 'Heritage palace architecture' },
  { url: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800&q=80', alt: 'Luxury pool at sunset' },
  { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80', alt: 'Desert camp golden sands' },
  { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', alt: 'Palace corridor with arches' },
  { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', alt: 'Camel safari in Thar Desert' },
  { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80', alt: 'Leopard in Jawai hills' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', alt: 'Rajasthani cuisine' },
  { url: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=800&q=80', alt: 'Udaipur city palace lake view' },
];

const scrollToId = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  const lenis = (window as LenisWindow).__lenis;
  if (lenis) lenis.scrollTo(element, { offset: -70 });
  else element.scrollIntoView({ behavior: 'smooth' });
};

const hotelImage = (hotel: typeof HOTELS_DATA[number]) => (
  hotel.slug === 'pushkar-dhani' ? hotel.aboutImage : hotel.heroImage
);

export const HomePage: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [activeHotel, setActiveHotel] = useState(0);
  const [activeExperience, setActiveExperience] = useState(0);
  const [lightbox, setLightbox] = useState({ isOpen: false, src: '', alt: '' });

  const featuredHotel = HOTELS_DATA[activeHotel] || HOTELS_DATA[0];
  const featuredExperience = EXPERIENCES_DATA[activeExperience] || EXPERIENCES_DATA[0];

  const portfolioStats = useMemo(() => [
    { value: `${HOTELS_DATA.length}+`, label: 'Properties' },
    { value: '10k+', label: 'Happy Guests' },
    { value: '15+', label: 'Years Excellence' },
    { value: '5★', label: 'Premium Service' },
  ], []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.immersive-panel');

      panels.forEach((panel) => {
        const stage = panel.querySelector<HTMLElement>('.immersive-panel__stage');
        const copy = panel.querySelectorAll<HTMLElement>('.immersive-copy > *');
        const media = panel.querySelectorAll<HTMLElement>('.depth-media, .holo-card, .floating-card, .destination-node');

        if (stage) {
          gsap.fromTo(stage,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }

        if (copy.length) {
          gsap.from(copy, {
            y: 30,
            opacity: 0,
            stagger: 0.06,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          });
        }

        if (media.length) {
          gsap.from(media, {
            y: 35,
            opacity: 0,
            stagger: 0.06,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });


      gsap.to('.hero-depth-bg', {
        scale: 1.18,
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.immersive-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const tiltTargets = gsap.utils.toArray<HTMLElement>('.tilt-3d');
      const cleanup: Array<() => void> = [];
      tiltTargets.forEach((target) => {
        let rect: DOMRect | null = null;
        
        const onEnter = () => {
          rect = target.getBoundingClientRect();
        };
        
        const onMove = (event: MouseEvent) => {
          if (!rect) rect = target.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(target, {
            rotateY: x * 10,
            rotateX: -y * 8,
            z: 34,
            duration: 0.45,
            ease: 'power3.out',
          });
        };
        const onLeave = () => {
          rect = null;
          gsap.to(target, { rotateX: 0, rotateY: 0, z: 0, duration: 0.55, ease: 'power3.out' });
        };
        target.addEventListener('mouseenter', onEnter);
        target.addEventListener('mousemove', onMove);
        target.addEventListener('mouseleave', onLeave);
        cleanup.push(() => {
          target.removeEventListener('mouseenter', onEnter);
          target.removeEventListener('mousemove', onMove);
          target.removeEventListener('mouseleave', onLeave);
        });
      });

      return () => cleanup.forEach(fn => fn());
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="immersive-site">
      <AppleStoryExperience />

      <section className="immersive-panel immersive-hero" id="home" aria-label="NAMO Hotel & Travel">
        <div className="hero-depth-bg" style={{ backgroundImage: `url(${hotelImage(featuredHotel)})` }} />
        <div className="immersive-shade" />
        <div className="immersive-panel__stage immersive-hero__stage">
          <div className="immersive-copy immersive-hero__copy">
            <p className="immersive-kicker">Est. in Rajasthan, India</p>
            <h1>Royal Hospitality, Reimagined in 3D</h1>
            <p>
              Discover heritage palaces, luxury resorts, desert camps and adventure camps
              curated under one trusted hospitality brand.
            </p>
            <div className="immersive-actions">
              <button className="immersive-btn immersive-btn--gold" onClick={() => scrollToId('hotels')}>
                Explore Properties
              </button>
              <button className="immersive-btn immersive-btn--ghost" onClick={() => scrollToId('contact')}>
                Plan Your Stay
              </button>
            </div>
          </div>

          <div className="hero-hologram tilt-3d" aria-label="Featured property">
            <img src={hotelImage(featuredHotel)} alt={featuredHotel.name} />
            <div className="hero-hologram__plate">
              <span>{featuredHotel.propertyType}</span>
              <strong>{featuredHotel.name}</strong>
              <em>{featuredHotel.location}</em>
            </div>
          </div>
        </div>
      </section>

      <section className="immersive-panel immersive-about" id="about" aria-labelledby="about-heading">
        <div className="immersive-panel__stage immersive-split">
          <div className="immersive-copy">
            <p className="immersive-kicker">About NAMO</p>
            <h2 id="about-heading">A Legacy of Royal Hospitality in Rajasthan</h2>
            <p>
              NAMO Hotel & Travel is a distinguished multi-property hospitality group rooted in
              the timeless grandeur of Rajasthan. From Udaipur palaces to Jaisalmer dunes and
              Jawai wilderness, we curate stays that connect guests with the soul of India's royal heartland.
            </p>
            <div className="stat-ribbon">
              {portfolioStats.map(stat => (
                <span key={stat.label}>
                  <strong>{stat.value}</strong>
                  <em>{stat.label}</em>
                </span>
              ))}
            </div>
          </div>

          <div className="depth-stack">
            <figure className="depth-media depth-media--large tilt-3d">
              <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80" alt="Palace corridor" />
            </figure>
            <div className="floating-card floating-card--top tilt-3d">
              <strong>Royal Stays</strong>
              <span>Heritage, comfort and warm Rajasthani care.</span>
            </div>
            <div className="floating-card floating-card--bottom tilt-3d">
              <strong>One Portfolio</strong>
              <span>Palace, hills, dhani, desert and wildlife.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="immersive-panel immersive-hotels" id="hotels" aria-labelledby="hotels-heading">
        <div className="immersive-panel__stage">
          <div className="immersive-copy immersive-center">
            <p className="immersive-kicker">Our Properties</p>
            <h2 id="hotels-heading">Five Extraordinary Destinations</h2>
            <p>Choose a property and watch the portfolio deck respond in real time.</p>
          </div>

          <div className="hotel-command-grid hotel-command-grid--spotlight">
            <article className="hotel-spotlight tilt-3d">
              <div className="hotel-spotlight__media">
                <img src={hotelImage(featuredHotel)} alt={featuredHotel.name} />
                <div className="hotel-spotlight__glow" />
              </div>
              <div className="hotel-spotlight__content">
                <p>{featuredHotel.badge || featuredHotel.propertyType}</p>
                <h3>{featuredHotel.name}</h3>
                <span><i className="fa-solid fa-location-dot" /> {featuredHotel.location}</span>
                <p>{featuredHotel.shortDescription}</p>
                <Link to={`/hotels/${featuredHotel.slug}`} className="immersive-link">
                  Explore Property <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            </article>

            <div className="hotel-selector-rail" aria-label="Select property">
              {HOTELS_DATA.map((hotel, index) => (
                <button
                  key={hotel.slug}
                  className={`hotel-selector-card tilt-3d ${index === activeHotel ? 'hotel-selector-card--active' : ''}`}
                  onClick={() => setActiveHotel(index)}
                >
                  <img src={hotelImage(hotel)} alt="" aria-hidden="true" />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{hotel.name}</strong>
                  <em>{hotel.city}</em>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="immersive-panel immersive-location" id="destinations" aria-labelledby="destinations-heading">
        <div className="immersive-copy immersive-center immersive-location__intro">
          <p className="immersive-kicker">Live Location Model</p>
          <h2 id="destinations-heading">Rajasthan, Rendered as a Destination System</h2>
          <p>Real district boundaries, hotel pins and a spatial way to understand the NAMO portfolio.</p>
        </div>
        <InteractiveEarth />
      </section>

      <section className="immersive-panel immersive-experiences" id="experiences" aria-labelledby="experiences-heading">
        <div className="immersive-panel__stage immersive-split">
          <div className="immersive-copy">
            <p className="immersive-kicker">Experiences</p>
            <h2 id="experiences-heading">{featuredExperience.title}</h2>
            <p>{featuredExperience.description}</p>
            <div className="experience-selector">
              {EXPERIENCES_DATA.map((experience, index) => (
                <button
                  key={experience.id}
                  className={index === activeExperience ? 'active' : ''}
                  onClick={() => setActiveExperience(index)}
                  aria-label={experience.title}
                >
                  <i className={experience.icon} />
                </button>
              ))}
            </div>
          </div>

          <figure className="experience-cube tilt-3d">
            <img src={featuredExperience.image} alt={featuredExperience.title} />
            <figcaption>
              <span>{featuredExperience.category}</span>
              <strong>{featuredExperience.title}</strong>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="immersive-panel immersive-destinations" aria-labelledby="journey-heading">
        <div className="immersive-panel__stage">
          <div className="immersive-copy immersive-center">
            <p className="immersive-kicker">Destination Path</p>
            <h2 id="journey-heading">Explore Royal Rajasthan</h2>
            <p>From lake city romance to desert horizons, every NAMO stay becomes part of one journey.</p>
          </div>

          <div className="destination-rail">
            {DESTINATIONS_DATA.map((destination, index) => (
              <article key={destination.id} className="destination-node tilt-3d">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <img src={destination.image} alt={destination.name} />
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="immersive-panel immersive-gallery" id="gallery" aria-labelledby="gallery-heading">
        <div className="immersive-panel__stage">
          <div className="immersive-copy immersive-center">
            <p className="immersive-kicker">Gallery</p>
            <h2 id="gallery-heading">Moments Captured</h2>
            <p>A visual wall of palaces, pools, dunes, safaris and Rajasthani warmth.</p>
          </div>
          <div className="spatial-gallery">
            {GALLERY_IMAGES.map((image, index) => (
              <button
                key={image.url}
                className="spatial-gallery__item tilt-3d"
                style={{ '--i': index } as React.CSSProperties}
                onClick={() => setLightbox({ isOpen: true, src: image.url, alt: image.alt })}
              >
                <img src={image.url} alt={image.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="immersive-panel immersive-events" id="events" aria-labelledby="events-heading">
        <div className="immersive-panel__stage immersive-split">
          <div className="immersive-copy">
            <p className="immersive-kicker">Events & Conferences</p>
            <h2 id="events-heading">Celebrate Life's Greatest Moments With Royal Grandeur</h2>
            <p>
              Our properties offer unforgettable backdrops for destination weddings, corporate
              meetings, family functions, conferences and private celebrations.
            </p>
            <button className="immersive-btn immersive-btn--gold" onClick={() => scrollToId('contact')}>
              Enquire Now
            </button>
          </div>
          <div className="event-orb tilt-3d">
            {['Destination Weddings', 'Corporate Meetings', 'Family Functions', 'Private Celebrations'].map(label => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="immersive-panel immersive-contact" id="contact" aria-labelledby="contact-heading">
        <div className="immersive-panel__stage immersive-split">
          <div className="immersive-copy">
            <p className="immersive-kicker">Get In Touch</p>
            <h2 id="contact-heading">Your Rajasthan Story Begins Here</h2>
            <p>
              Reach our reservations team for stays, events, destination weddings and custom
              Rajasthan travel experiences.
            </p>
            <div className="contact-pods">
              <a href="tel:+918690278979"><i className="fa-solid fa-phone" /> +91 86902 78979</a>
              <a href="mailto:namohotelandtravel@gmail.com"><i className="fa-solid fa-envelope" /> namohotelandtravel@gmail.com</a>
              <span><i className="fa-solid fa-location-dot" /> 02, Surya Nagar, Savina, Udaipur, Rajasthan</span>
            </div>
          </div>
          <div className="immersive-form">
            <ContactForm />
          </div>

        </div>
      </section>

      <GalleryLightbox
        isOpen={lightbox.isOpen}
        imageSrc={lightbox.src}
        imageAlt={lightbox.alt}
        onClose={() => setLightbox({ isOpen: false, src: '', alt: '' })}
      />
    </main>
  );
};
