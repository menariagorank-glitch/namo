export interface Room {
  id: string;
  name: string;
  countBadge?: string;
  badge?: string;
  description: string;
  image: string;
  tags: string[];
}

export interface Amenity {
  icon: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  stars: number;
  text: string;
}

export interface Hotel {
  slug: string;
  name: string;
  tagline: string;
  propertyType: string;
  propertyTypeIcon: string;
  location: string;
  city: string;
  heroImage: string;
  aboutImage: string;
  badge?: string;
  address: string;
  landmark?: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  shortDescription: string;
  fullDescription: string[];
  highlights: string[];
  rooms: Room[];
  amenities: Amenity[];
  gallery: GalleryImage[];
  testimonials?: Testimonial[];
}

export interface Experience {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  reverse?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
}
