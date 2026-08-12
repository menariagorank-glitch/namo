import { Hotel, Experience, Destination, Testimonial } from '../types/hotel';

export const HOTELS_DATA: Hotel[] = [
  {
    slug: 'kushal-bagh-palace',
    name: 'The Kushal Bagh Palace',
    tagline: 'Royal Heritage Hotel in Udaipur',
    propertyType: 'Heritage Property',
    propertyTypeIcon: 'fa-solid fa-crown',
    location: 'Savina, Udaipur, Rajasthan',
    city: 'Udaipur',
    heroImage: '/images/kushal-bagh-palace.jpg',
    aboutImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80',
    badge: 'Heritage Palace',
    address: '02, Surya Nagar, The Kushal Bagh Palace, Savina, Udaipur, Rajasthan 313002',
    landmark: 'Located at Savina, near City Palace & Lake Pichola circuit — Udaipur, Rajasthan',
    phone: '+91 86902 78979',
    email: 'namohotelandtravel@gmail.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.6946!2d73.7051!3d24.5539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967efc464bf0001%3A0x!2sSavina%2C%20Udaipur%2C%20Rajasthan%20313002!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    shortDescription: 'A magnificent heritage palace in the City of Lakes, blending royal Rajputana architecture with timeless luxury. An experience of regal elegance.',
    fullDescription: [
      'The Kushal Bagh Palace is a premier heritage property situated in Udaipur, Rajasthan. Designed to echo the opulence of Rajasthan’s royal court, the palace features magnificent domed jharokhas, marble courtyards, lush gardens, and lavishly appointed suites.',
      'Guests at The Kushal Bagh Palace enjoy authentic Rajputana hospitality paired with modern world-class amenities. Whether celebrating a grand destination wedding, enjoying a quiet luxury vacation, or exploring the romantic lakes of Udaipur, our palace promises an unforgettable experience.'
    ],
    highlights: [
      'Royal Heritage Suite accommodation with jharokha views',
      'Lakeside courtyard dining serving authentic Mewari thali',
      'Grand swimming pool surrounded by landscaped gardens',
      'Spacious royal banquet hall for weddings & grand celebrations',
      'Centrally located with easy access to Lake Pichola and City Palace',
      '24/7 dedicated concierge service & royal welcome'
    ],
    rooms: [
      {
        id: 'kushal-royal-suite',
        name: 'Royal Heritage Suite',
        countBadge: 'Executive Suites',
        description: 'Palatial suite adorned with hand-carved Jodhpur stone, silken drapery, king-size canopy bed, private sitting area, and opulent marble bathroom.',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Free WiFi', 'Royal Canopy Bed', 'Courtyard View', 'Mini Bar']
      },
      {
        id: 'kushal-deluxe-room',
        name: 'Palace Deluxe Room',
        countBadge: 'Luxury Deluxe',
        description: 'Spacious room featuring traditional Rajasthani decor, plush bedding, air conditioning, modern amenities, and serene garden views.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Free WiFi', 'King Bed', 'Garden View', 'Flat Screen TV']
      }
    ],
    amenities: [
      { icon: 'fa-solid fa-water-ladder', title: 'Royal Swimming Pool', description: 'Crystal-clear outdoor pool framed by traditional arches and sunbeds.' },
      { icon: 'fa-solid fa-utensils', title: 'Mewari Fine Dining', description: 'Multi-cuisine restaurant specializing in authentic royal Rajasthani recipes.' },
      { icon: 'fa-solid fa-wifi', title: 'High-Speed WiFi', description: 'Complimentary high-speed internet access throughout the palace property.' },
      { icon: 'fa-solid fa-champagne-glasses', title: 'Event & Banquet Lawns', description: 'Grand manicured lawns suitable for luxury weddings and corporate galas.' }
    ],
    gallery: [
      { id: 'g1', url: '/images/kushal-bagh-palace.jpg', alt: 'The Kushal Bagh Palace exterior view' },
      { id: 'g2', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', alt: 'Palace arches and corridor' },
      { id: 'g3', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80', alt: 'Royal suite room bedroom' },
      { id: 'g4', url: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=600&q=80', alt: 'Palace swimming pool at sunset' }
    ]
  },
  {
    slug: 'sun-hill-resort',
    name: 'Sun Hill Resort',
    tagline: 'Luxury Hill Resort Kumbhalgarh',
    propertyType: 'Luxury Hill Resort — Panther Point',
    propertyTypeIcon: 'fa-solid fa-mountain',
    location: 'Panther Point, Kumbhalgarh, Rajasthan',
    city: 'Kumbhalgarh',
    heroImage: '/images/sun-hill-resort.jpg',
    aboutImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80',
    badge: 'Luxury Resort',
    address: 'Sun Hill Resort, Panther Point, Kumbhalgarh, Rajasthan 313325',
    landmark: 'Located at Panther Point, Kumbhalgarh — Aravalli Hills, Rajasthan, India',
    phone: '+91 86902 78979',
    email: 'namohotelandtravel@gmail.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14500.0000!2d73.5833!3d25.1500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396825c000000001%3A0x!2sKumbhalgarh%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    shortDescription: 'Perched in the Aravalli hills near the magnificent Kumbhalgarh Fort, Sun Hill Resort offers spectacular views, swimming pools and serene hilltop luxury.',
    fullDescription: [
      'Sun Hill Resort is a tranquil luxury haven located at Panther Point in Kumbhalgarh, Rajasthan. Set amid the serene Aravalli hills, this boutique hill resort offers breathtaking vistas of nature, peaceful surroundings, and uncompromised hospitality.',
      'Featuring 06 exclusive rooms (04 Super Deluxe Rooms & 02 Deluxe Rooms), a Big Garden, a swimming pool overlooking rolling hills, an exquisite restaurant, and dedicated parking, Sun Hill Resort is the ultimate sanctuary for families, couples, and nature lovers looking for a luxurious stay away from city noise.'
    ],
    highlights: [
      'Prime location at Panther Point, Kumbhalgarh, Rajasthan',
      'Boutique accommodation with 06 exclusive rooms (04 Super Deluxe & 02 Deluxe)',
      'Big Garden with panoramic mountain and sunset views',
      'Swimming Pool set against Aravalli hills backdrop',
      'Multi-cuisine Restaurant & family friendly environment',
      'Ample free parking and premium luxury services'
    ],
    rooms: [
      {
        id: 'sun-super-deluxe',
        name: 'Super Deluxe Room',
        countBadge: '04 Super Deluxe Rooms',
        description: 'Luxury hilltop rooms featuring king bedding, private balcony overlooking Panther Point, air-conditioning, en-suite bathroom, and elegant furnishings.',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Free WiFi', 'Panther Point View', 'King Bed', 'Balcony']
      },
      {
        id: 'sun-deluxe',
        name: 'Deluxe Room',
        countBadge: '02 Deluxe Rooms',
        description: 'Cozy and stylish mountain-facing rooms equipped with air-conditioning, soft bedding, modern bathroom, and peaceful hill vistas.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Free WiFi', 'Hill View', 'Double Bed', 'Intercom']
      }
    ],
    amenities: [
      { icon: 'fa-solid fa-water-ladder', title: 'Hillside Swimming Pool', description: 'Scenic outdoor pool overlooking the lush Aravalli valley.' },
      { icon: 'fa-solid fa-tree', title: 'Big Landscaped Garden', description: 'Expansive green lawns perfect for evening walks, yoga and stargazing.' },
      { icon: 'fa-solid fa-utensils', title: 'Multi-Cuisine Restaurant', description: 'Serving freshly cooked North Indian, Rajasthani and Continental delicacies.' },
      { icon: 'fa-solid fa-square-parking', title: 'Ample Free Parking', description: 'Secure and spacious parking area for personal vehicles and tour coaches.' }
    ],
    gallery: [
      { id: 'sg1', url: '/images/sun-hill-resort.jpg', alt: 'Sun Hill Resort exterior and hill view' },
      { id: 'sg2', url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80', alt: 'Resort pool overlooking Aravalli hills' },
      { id: 'sg3', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80', alt: 'Super deluxe room room setup' },
      { id: 'sg4', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', alt: 'Resort garden area' }
    ]
  },
  {
    slug: 'pushkar-dhani',
    name: 'Pushkar Dhani',
    tagline: 'Traditional Village Resort Pushkar',
    propertyType: 'Cultural Dhani Experience',
    propertyTypeIcon: 'fa-solid fa-fire',
    location: 'Pushkar, Rajasthan',
    city: 'Pushkar',
    heroImage: 'https://images.unsplash.com/photo-1565073624497-698e309c2085?auto=format&fit=crop&w=800&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=900&q=80',
    badge: 'Cultural Village',
    address: 'Pushkar Dhani, Near Sacred Lake & Fair Ground, Pushkar, Rajasthan 305022',
    landmark: 'Located near sacred Pushkar Lake & camel safari trail — Pushkar, Rajasthan',
    phone: '+91 86902 78979',
    email: 'namohotelandtravel@gmail.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14275.0000!2d74.5500!3d26.4833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be4b000000001%3A0x!2sPushkar%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    shortDescription: 'A soulful Rajasthani village experience in sacred Pushkar — immerse yourself in camel rides, folk performances, bonfires and authentic cuisine.',
    fullDescription: [
      'Pushkar Dhani captures the quintessential charm of rural Rajasthan. Styled as an eco-conscious heritage dhani (traditional hamlets), it offers visitors a peaceful retreat surrounded by desert flora, clay-textured architecture, and warm rustic hospitality.',
      'Guests can enjoy traditional Rajasthani thali cooked over clay stoves, vibrant evening folk dance & music performances under open skies, camel cart rides across Pushkar sand dunes, and serene moments near sacred Pushkar Lake.'
    ],
    highlights: [
      'Authentic Rajasthani Dhani mud-cottage architecture',
      'Open-air cultural courtyard with evening Kalbeliya dance',
      'Traditional organic Rajasthani dining & chulha cooking',
      'Desert camel safaris and quad biking in Pushkar sand dunes',
      'Proximity to Brahma Temple and Sacred Pushkar Lake',
      'Peaceful eco-resort environment surrounded by nature'
    ],
    rooms: [
      {
        id: 'pushkar-royal-cottage',
        name: 'Heritage Royal Cottage',
        countBadge: 'Mud Architecture Cottages',
        description: 'Beautifully decorated cottage featuring handcrafted bamboo furniture, ethnic wall paintings, air conditioning, modern bathroom, and private veranda.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Free WiFi', 'Private Veranda', 'Organic Decor', 'Queen Bed']
      },
      {
        id: 'pushkar-dhani-room',
        name: 'Dhani Deluxe Room',
        countBadge: 'Village Style Rooms',
        description: 'Cozy traditional room blending rustic charm with modern comfort, offering garden access and quiet surroundings.',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Free WiFi', 'Garden Access', 'Rustic Charm']
      }
    ],
    amenities: [
      { icon: 'fa-solid fa-fire-flame-curved', title: 'Folk Music & Bonfire', description: 'Nightly campfire gatherings with traditional Rajasthani musicians and dancers.' },
      { icon: 'fa-solid fa-utensils', title: 'Desi Chulha Kitchen', description: 'Delicious Dal Baati Churma cooked over slow wood fires.' },
      { icon: 'fa-solid fa-horse', title: 'Camel Safari Trails', description: 'Guided camel rides across the golden Pushkar dunes.' },
      { icon: 'fa-solid fa-campground', title: 'Cultural Courtyard', description: 'Spacious central courtyard for relaxation, folk art workshops and tea time.' }
    ],
    gallery: [
      { id: 'pg1', url: 'https://images.unsplash.com/photo-1565073624497-698e309c2085?auto=format&fit=crop&w=600&q=80', alt: 'Pushkar Dhani village resort exterior' },
      { id: 'pg2', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80', alt: 'Bonfire night at Pushkar Dhani' },
      { id: 'pg3', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80', alt: 'Camel ride in Pushkar dunes' },
      { id: 'pg4', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80', alt: 'Traditional Rajasthani meal' }
    ]
  },
  {
    slug: 'namo-desert-camp',
    name: 'Namo Desert Camp Talai',
    tagline: 'Luxury Swiss Tents in Sam Sand Dunes Jaisalmer',
    propertyType: 'Luxury Desert Camp',
    propertyTypeIcon: 'fa-solid fa-campground',
    location: 'Sam, Jaisalmer, Rajasthan',
    city: 'Jaisalmer',
    heroImage: '/images/namo-desert-camp.jpg',
    aboutImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80',
    badge: 'Desert Camp',
    address: 'Namo Desert Camp Talai, Main Sam Sand Dunes Road, Sam, Jaisalmer, Rajasthan 345001',
    landmark: 'Located at Sam Sand Dunes, Thar Desert — Jaisalmer, Rajasthan',
    phone: '+91 86902 78979',
    email: 'namohotelandtravel@gmail.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28200.0000!2d70.5167!3d26.8333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3947b00000000001%3A0x!2sSam%20Sand%20Dunes%2C%20Jaisalmer!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    shortDescription: 'Luxury Swiss tents amid the golden Sam Sand Dunes. Wake up to a Thar Desert sunrise, enjoy camel safaris, cultural performances and starlit bonfires.',
    fullDescription: [
      'Namo Desert Camp Talai is an exquisite glamping destination located directly at Sam Sand Dunes, Jaisalmer. Offering the true spirit of the Thar Desert, our luxury Swiss AC Tents combine royal Rajasthani hospitality with modern creature comforts.',
      'Spend your days thrilling over dune bashing in 4x4 jeeps, embarking on sunset camel rides, and watching mesmerising desert sunsets. At night, gather around the desert campfire for Rajasthani cultural song & dance, followed by a lavish buffet dinner under the starry night sky.'
    ],
    highlights: [
      'Luxury Swiss AC Tents with attached modern bathrooms',
      'Golden hour camel safaris & high-speed dune bashing',
      'Vibrant cultural night with Kalbeliya dancers and Langa singers',
      'Starlit desert campfire with evening snacks and gala dinner',
      'Direct access to Sam Sand Dunes for sunrise & sunset',
      '24/7 security, power backup and warm desert hospitality'
    ],
    rooms: [
      {
        id: 'desert-swiss-ac-tent',
        name: 'Luxury Swiss AC Tent',
        countBadge: 'Desert Luxury Tents',
        description: 'Spacious weather-proof canvas tent fitted with air conditioning, king bed, embroidered drapery, attached tiled bathroom with hot water, and private outdoor seating.',
        image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Attached Bath', 'Hot Water', 'Sand Dune View', 'King Bed']
      },
      {
        id: 'desert-royal-tent',
        name: 'Royal Heritage Desert Suite',
        countBadge: 'VIP Desert Suite',
        description: 'Ultra-luxurious spacious tented suite featuring a plush living area, royal furnishings, climate control, premium toiletries, and personalized butler service.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Living Area', 'Butler Service', 'Dune Facing', 'VIP Amenities']
      }
    ],
    amenities: [
      { icon: 'fa-solid fa-campground', title: 'Swiss AC Tents', description: 'Weather-resistant luxury tents with modern plush bedding and air-conditioning.' },
      { icon: 'fa-solid fa-horse', title: 'Camel & Jeep Safaris', description: 'Thrilling desert rides over high dunes at golden sunset.' },
      { icon: 'fa-solid fa-fire', title: 'Campfire Cultural Night', description: 'Traditional music, snake dance performance, and stargazing session.' },
      { icon: 'fa-solid fa-utensils', title: 'Thar Buffet Dining', description: 'Sumptuous Rajasthani thali buffet with authentic local specialties.' }
    ],
    gallery: [
      { id: 'dg1', url: '/images/namo-desert-camp.jpg', alt: 'Namo Desert Camp Talai Jaisalmer' },
      { id: 'dg2', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80', alt: 'Thar desert golden sand dunes' },
      { id: 'dg3', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80', alt: 'Camel ride sunset Jaisalmer' },
      { id: 'dg4', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80', alt: 'Bonfire cultural show under stars' }
    ]
  },
  {
    slug: 'namo-adventure-camp',
    name: 'Namo Adventure Camp Jawai',
    tagline: 'Wildlife & Leopard Safari Camp in Jawai',
    propertyType: 'Wildlife & Wilderness Camp',
    propertyTypeIcon: 'fa-solid fa-paw',
    location: 'Jawai, Rajasthan',
    city: 'Jawai',
    heroImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80',
    badge: 'Adventure Camp',
    address: 'Namo Adventure Camp, Jawai Bandh Wilderness Area, Pali District, Jawai, Rajasthan 306126',
    landmark: 'Located in the granite hills & leopard territory near Jawai Bandh — Rajasthan',
    phone: '+91 86902 78979',
    email: 'namohotelandtravel@gmail.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28900.0000!2d73.1500!3d25.1000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968600000000001%3A0x!2sJawai%20Bandh%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    shortDescription: 'Set in the dramatic granite hills of Jawai — home to India’s densest leopard population. A thrilling wildlife camp blending adventure with luxury under the stars.',
    fullDescription: [
      'Namo Adventure Camp Jawai offers an extraordinary wilderness experience nestled among the billion-year-old granite rock formations of Jawai. Known worldwide as the land where humans and leopards coexist in harmony, Jawai is Rajasthan’s premier wildlife haven.',
      'Our luxury adventure camp provides open-top 4x4 jeep safaris guided by expert trackers to spot wild leopards, migratory birds around Jawai Dam, and Rabari tribal hamlets. Unwind after an action-packed safari on your private deck with panoramic views of the wild terrain.'
    ],
    highlights: [
      'Prime location in Jawai leopard corridor & granite hills',
      'Open-top 4x4 Jeep Leopard Safaris at dawn & dusk',
      'Luxury Wilderness Tents with private viewing decks',
      'Expert naturalist guides for birdwatching and wildlife tracking',
      'Bush dining & bonfire dinners surrounded by wilderness',
      'High safety standards, eco-friendly setup & warm hospitality'
    ],
    rooms: [
      {
        id: 'jawai-luxury-wilderness-tent',
        name: 'Luxury Wilderness Tent',
        countBadge: 'Safari Tents',
        description: 'Eco-luxury tent with hard flooring, air conditioning, plush bedding, modern en-suite bathroom, and a spacious private wooden deck facing granite hills.',
        image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Private Deck', 'Hill View', 'En-suite Bathroom', 'Naturalist Guide']
      },
      {
        id: 'jawai-safari-suite',
        name: 'Safari Suite Cottage',
        countBadge: 'Wilderness Suite',
        description: 'Stone-crafted suite cottage designed with rustic elegance, featuring panoramic glass windows, outdoor lounge, air-conditioning, and luxury amenities.',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=80',
        tags: ['AC', 'Glass Windows', 'Mountain View', 'Lounge Deck', 'Free WiFi']
      }
    ],
    amenities: [
      { icon: 'fa-solid fa-paw', title: '4x4 Leopard Safari', description: 'Twice-daily open jeep safaris with experienced wildlife naturalists.' },
      { icon: 'fa-solid fa-binoculars', title: 'Birdwatching & Dam Tours', description: 'Excursions to Jawai Bandh to spot flamingos, sarus cranes and crocodiles.' },
      { icon: 'fa-solid fa-campground', title: 'Wilderness Dining Deck', description: 'Al-fresco dining under star-filled skies surrounded by granite hills.' },
      { icon: 'fa-solid fa-fire', title: 'Campfire Stories', description: 'Evening bonfire discussions with naturalists sharing stories of Jawai wildlife.' }
    ],
    gallery: [
      { id: 'ag1', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', alt: 'Namo Adventure Camp Jawai landscape' },
      { id: 'ag2', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80', alt: 'Leopard on Jawai granite hills' },
      { id: 'ag3', url: 'https://images.unsplash.com/photo-1561362746-0b3b9b2a571c?auto=format&fit=crop&w=600&q=80', alt: 'Jawai hills and wilderness landscape' },
      { id: 'ag4', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80', alt: 'Evening bonfire at Jawai camp' }
    ]
  }
];

export const EXPERIENCES_DATA: Experience[] = [
  {
    id: 'exp-1',
    category: 'Accommodation',
    title: 'Luxury & Heritage Stays',
    description: 'Step into palatial suites adorned with hand-carved Jodhpur stone, silken drapes and antique furnishings. Our heritage rooms transport you to the golden age of Rajputana while enveloping you in every modern luxury.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80',
    icon: 'fa-solid fa-hotel',
    reverse: false
  },
  {
    id: 'exp-2',
    category: 'Leisure',
    title: 'Pool & Garden Retreat',
    description: 'Unwind beside shimmering pools framed by bougainvillea and Aravalli vistas. Our garden terraces and open courtyards are spaces designed for total serenity — the ideal setting for morning yoga or a sunset cocktail.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
    icon: 'fa-solid fa-water-ladder',
    reverse: true
  },
  {
    id: 'exp-3',
    category: 'Adventure',
    title: 'Desert Safari & Camel Rides',
    description: 'Ride into the heart of the Thar Desert on camelback as the sun melts into the horizon. Watch the dunes transform from gold to amber to rose — an experience so breathtaking it feels like a scene from a painting.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
    icon: 'fa-solid fa-horse',
    reverse: false
  },
  {
    id: 'exp-4',
    category: 'Wildlife',
    title: 'Wildlife & Leopard Safari',
    description: 'Jawai is home to one of the highest concentrations of wild leopards in India. Venture out at dawn on a jeep safari led by expert naturalists — encountering these magnificent creatures in their natural rocky habitat.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80',
    icon: 'fa-solid fa-paw',
    reverse: true
  },
  {
    id: 'exp-5',
    category: 'Culture',
    title: 'Bonfire Nights & Rajasthani Culture',
    description: 'Gather under a canopy of stars around a crackling bonfire as folk musicians play the ravanhatta and kalbeliya dancers weave their magic. Taste traditional Rajasthani thali and hear ancient desert stories come alive.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=900&q=80',
    icon: 'fa-solid fa-fire-flame-curved',
    reverse: false
  },
  {
    id: 'exp-6',
    category: 'Culinary',
    title: 'Luxury Dining & Open Café',
    description: 'From lavish Rajasthani thali spreads served in palace courtyards to al fresco café breakfasts with valley views — our culinary experiences are as rich in flavour as they are in ambiance. Every meal is an occasion.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    icon: 'fa-solid fa-utensils',
    reverse: true
  }
];

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'dest-1',
    name: 'Udaipur',
    description: 'The City of Lakes — where palaces shimmer on tranquil waters and every alley tells a royal tale.',
    image: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dest-2',
    name: 'Jaisalmer',
    description: 'The Golden City — where a living medieval fortress rises from a sea of sand at the edge of the Thar.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dest-3',
    name: 'Jawai',
    description: 'Dramatic granite hills and crocodile-filled lakes — home to wild leopards and an extraordinary wilderness.',
    image: 'https://images.unsplash.com/photo-1561362746-0b3b9b2a571c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dest-4',
    name: 'Pushkar',
    description: "Sacred lake, ancient Brahma temple and the world's most famous camel fair — a spiritual and cultural treasure.",
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dest-5',
    name: 'Kumbhalgarh',
    description: 'The Great Wall of India — a UNESCO fort with the second-longest wall in the world, rising from Aravalli mist.',
    image: 'https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?auto=format&fit=crop&w=600&q=80'
  }
];

export const GLOBAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Arjun Mehta',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    stars: 5,
    text: '"Our stay at The Kushal Bagh Palace was simply extraordinary. The palace architecture, the attentive staff and the breathtaking views of Udaipur from our suite made it an unforgettable anniversary celebration. NAMO\'s hospitality is truly world-class."'
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    location: 'Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b494?auto=format&fit=crop&w=80&q=80',
    stars: 5,
    text: '"Namo Desert Camp Talai was the highlight of our Rajasthan road trip. Waking up to a desert sunrise from our luxury tent, followed by a camel ride at golden hour and a bonfire with folk music — it felt like a dream. Every detail was perfect."'
  },
  {
    id: 't3',
    name: 'Rahul Verma',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    stars: 5,
    text: '"We held our corporate leadership retreat at Sun Hill Resort in Kumbhalgarh and the team couldn\'t have been more professional. The conference facilities, the stunning hill views and the exceptional food made it a truly productive and inspiring experience."'
  },
  {
    id: 't4',
    name: 'Kavita Singh',
    location: 'Pune, India',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
    stars: 5,
    text: '"Namo Adventure Camp in Jawai is a wildlife lover\'s paradise. We spotted three leopards on our very first safari! The tented accommodation was surprisingly luxurious, the food was delicious and the naturalist guides were exceptional. Highly recommended."'
  }
];
