import React, { useEffect } from 'react';

interface GalleryLightboxProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  isOpen,
  imageSrc,
  imageAlt,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`lightbox ${isOpen ? 'active' : ''}`}
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="lightbox__close" id="lightbox-close" aria-label="Close image viewer" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      {imageSrc ? (
        <img className="lightbox__img" id="lightbox-img" src={imageSrc} alt={imageAlt || 'Gallery view'} />
      ) : (
        <div style={{ color: '#fff', fontSize: '1rem' }}>Loading image...</div>
      )}
    </div>
  );
};
