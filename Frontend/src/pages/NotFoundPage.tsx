import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <main style={{ paddingBlock: '8rem', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container text-center">
        <div style={{ fontSize: '5rem', color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Page Not Found</h1>
        <p style={{ maxWidth: '540px', marginInline: 'auto', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          The page you are looking for does not exist or has been moved. Explore our luxury properties across Rajasthan or return home.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-gold">
            Return to Home
          </Link>
          <a href="/#hotels" className="btn btn-outline-gold">
            Explore Properties
          </a>
        </div>
      </div>
    </main>
  );
};
