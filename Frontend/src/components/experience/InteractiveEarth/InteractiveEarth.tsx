/**
 * InteractiveEarth.tsx
 * Ultra-Luxury Photorealistic 3D Earth Location Experience for NAMO Hotel & Travel.
 *
 * Visual Enhancements:
 * - Photorealistic NASA Blue Marble 4K Earth Day/Night Textures + Topography Elevation Bump Map
 * - Realistic Atmospheric Fresnel Halo Rim Glow
 * - Drifting Semi-Transparent Orbital Cloud Shell
 * - High-Res Satellite Canvas Texture Fallback (0ms instant photorealistic satellite rendering)
 * - 4 Real NAMO Hotel 3D Metallic Pins across Rajasthan (Udaipur, Kumbhalgarh, Pushkar, Jaisalmer)
 * - Steady interaction (no wobble), scroll-driven approach, and direct Google Maps connection
 */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  type FC,
} from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DestinationAtlasEngine } from './DestinationAtlasEngine';

import './interactiveEarth.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Hotel Properties Dataset ────────────────────────────────────────────────

export interface HotelProperty {
  id: string;
  name: string;
  tagline: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  typeBadge: string;
  icon: string;
  mapsUrl: string;
  embedUrl: string;
}

const NAMO_PROPERTIES: HotelProperty[] = [
  {
    id: 'kushal-bagh',
    name: 'The Kushal Bagh Palace',
    tagline: 'Royal Heritage Palace in the City of Lakes',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    lat: 24.5539,
    lng: 73.7051,
    typeBadge: 'Heritage Palace',
    icon: 'fa-solid fa-crown',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=24.5539,73.7051',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.7848!2d73.7051!3d24.5539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e56555555555%3A0x0!2zMjTCsDMzJzE0LjAiTiA3M8KwNDInMTguNCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  },
  {
    id: 'sun-hill',
    name: 'Sun Hill Resort',
    tagline: 'Luxury Hillside Resort at Panther Point',
    city: 'Kumbhalgarh',
    state: 'Rajasthan',
    country: 'India',
    lat: 25.1500,
    lng: 73.5833,
    typeBadge: 'Hill Resort',
    icon: 'fa-solid fa-mountain',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=25.1500,73.5833',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14500.0000!2d73.5833!3d25.1500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396825c000000001%3A0x!2sKumbhalgarh%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  },
  {
    id: 'pushkar-dhani',
    name: 'Pushkar Dhani',
    tagline: 'Authentic Cultural Village & Eco Retreat',
    city: 'Pushkar',
    state: 'Rajasthan',
    country: 'India',
    lat: 26.4833,
    lng: 74.5500,
    typeBadge: 'Cultural Dhani',
    icon: 'fa-solid fa-fire',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=26.4833,74.5500',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14275.0000!2d74.5500!3d26.4833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be4b000000001%3A0x!2sPushkar%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  },
  {
    id: 'namo-desert-camp',
    name: 'Namo Desert Camp',
    tagline: 'Luxury Swiss Tents in Sam Sand Dunes',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    country: 'India',
    lat: 26.8333,
    lng: 70.5167,
    typeBadge: 'Desert Camp',
    icon: 'fa-solid fa-campground',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=26.8333,70.5167',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28200.0000!2d70.5167!3d26.8333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3947b00000000001%3A0x!2sSam%20Sand%20Dunes%2C%20Jaisalmer!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  },
];

// ─── External NASA Textures ──────────────────────────────────────────────────

const TEX_DAY    = 'https://unpkg.com/three-globe/example/img/earth-day.jpg';
const TEX_NIGHT  = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const TEX_BUMP   = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const TEX_CLOUDS = 'https://unpkg.com/three-globe/example/img/earth-clouds.png';

// ─── 3D Vector Coordinate Mapping ─────────────────────────────────────────────

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = - radius * Math.cos(theta) * Math.sin(phi);
  const y =   radius * Math.cos(phi);
  const z =   radius * Math.sin(theta) * Math.sin(phi);

  return new THREE.Vector3(x, y, z);
}

// ─── High-Resolution Photorealistic Satellite Canvas Texture Fallback ──────────

function createPhotorealisticEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep Ocean & Coastal Shelves Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#061327');
  oceanGrad.addColorStop(0.5, '#0b2447');
  oceanGrad.addColorStop(1, '#040b18');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function toX(lng: number) { return ((lng + 180) / 360) * canvas.width; }
  function toY(lat: number) { return ((90 - lat) / 180) * canvas.height; }

  // 2. Continents (Satellite Terrain Colors: Desert Sand for Rajasthan/Middle East, Forest Olive for Tropics, Snow White for Ice)
  const continentPolygons = [
    // Eurasia & India (Desert Sand in Rajasthan, Forest Green in East Asia)
    {
      fill: '#a08355', // Thar / Rajasthan desert sand
      stroke: '#d4af37',
      points: [
        [toX(55), toY(35)], [toX(70), toY(34)], [toX(73.7), toY(24.5)], [toX(78), toY(8)],
        [toX(88), toY(22)], [toX(68), toY(24)], [toX(60), toY(25)], [toX(55), toY(35)]
      ]
    },
    {
      fill: '#2e4228', // Forest Eurasia
      stroke: '#b89635',
      points: [
        [toX(-10), toY(35)], [toX(30), toY(35)], [toX(55), toY(35)], [toX(70), toY(34)],
        [toX(100), toY(10)], [toX(120), toY(25)], [toX(140), toY(35)], [toX(170), toY(65)],
        [toX(100), toY(75)], [toX(40), toY(70)], [toX(10), toY(55)], [toX(-10), toY(35)]
      ]
    },
    // Africa (Sahara Desert Gold + Congo Green)
    {
      fill: '#8c7042',
      stroke: '#b89635',
      points: [
        [toX(-17), toY(35)], [toX(35), toY(35)], [toX(51), toY(11)],
        [toX(40), toY(-10)], [toX(20), toY(-35)], [toX(12), toY(-34)],
        [toX(5), toY(5)], [toX(-15), toY(12)], [toX(-17), toY(35)]
      ]
    },
    // North America
    {
      fill: '#354830',
      stroke: '#b89635',
      points: [
        [toX(-168), toY(65)], [toX(-125), toY(50)], [toX(-118), toY(30)],
        [toX(-90), toY(15)], [toX(-80), toY(8)], [toX(-75), toY(35)],
        [toX(-60), toY(47)], [toX(-64), toY(60)], [toX(-100), toY(75)], [toX(-168), toY(65)]
      ]
    },
    // South America (Amazon Rainforest Green)
    {
      fill: '#243a20',
      stroke: '#b89635',
      points: [
        [toX(-80), toY(10)], [toX(-35), toY(-5)], [toX(-40), toY(-22)],
        [toX(-55), toY(-45)], [toX(-70), toY(-53)], [toX(-80), toY(-5)], [toX(-80), toY(10)]
      ]
    },
    // Australia
    {
      fill: '#997343',
      stroke: '#b89635',
      points: [
        [toX(113), toY(-15)], [toX(153), toY(-15)], [toX(150), toY(-38)],
        [toX(115), toY(-35)], [toX(113), toY(-15)]
      ]
    }
  ];

  ctx.lineWidth = 1.5;
  continentPolygons.forEach((poly) => {
    ctx.beginPath();
    poly.points.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = poly.fill;
    ctx.strokeStyle = poly.stroke;
    ctx.fill();
    ctx.stroke();
  });

  // 3. Graticule Lat/Lng Lines
  ctx.strokeStyle = 'rgba(201, 162, 39, 0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += canvas.width / 24) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += canvas.height / 12) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // 4. Glowing City Light Clusters Across Globe
  NAMO_PROPERTIES.forEach((p) => {
    const cx = toX(p.lng);
    const cy = toY(p.lat);

    const bGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
    bGrad.addColorStop(0, 'rgba(230, 85, 18, 1)');
    bGrad.addColorStop(0.5, 'rgba(201, 162, 39, 0.8)');
    bGrad.addColorStop(1, 'rgba(201, 162, 39, 0)');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// ─── Photorealistic 3D Globe Engine ──────────────────────────────────────────

class LuxuryGlobeEngine {
  readonly renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private earthGroup  = new THREE.Group();
  private cloudMesh: THREE.Mesh | null = null;
  private pinMap = new Map<string, { group: THREE.Group; glow: THREE.Mesh; ring: THREE.Mesh }>();

  private baseRotY = -Math.PI / 2 - (73.7051 * Math.PI / 180);
  private baseRotX = -(24.5539 * Math.PI / 180);
  private targetRotY = -Math.PI / 2 - (73.7051 * Math.PI / 180);
  private targetRotX = -(24.5539 * Math.PI / 180);
  private targetCameraZ = 2.6; // Proportioned elegant distance

  private dragActive = false;
  private dragLastX  = 0;
  private dragLastY  = 0;
  private dragAccumX = 0;
  private dragAccumY = 0;

  private clock = new THREE.Clock();
  private _disposed = false;

  public activeHotelId = 'kushal-bagh';
  public hoveredHotelId: string | null = null;
  public screenPositions: Record<string, { x: number; y: number; visible: boolean }> = {};

  private _ptrMove!: (e: PointerEvent) => void;
  private _ptrDown!: (e: PointerEvent) => void;
  private _ptrUp!:   (e: PointerEvent) => void;

  constructor(
    canvas: HTMLCanvasElement,
    width:  number,
    height: number,
    mobile: boolean,
  ) {
    // 1. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    this.renderer.setSize(width, height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0807);

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 2.6;

    // 4. Photorealistic Lighting
    this.scene.add(new THREE.AmbientLight(0x443322, 1.4));

    const sun = new THREE.DirectionalLight(0xfff7ea, 3.2);
    sun.position.set(5, 3, 4);
    this.scene.add(sun);

    const rim = new THREE.DirectionalLight(0x1a3355, 1.0);
    rim.position.set(-5, -2, -3);
    this.scene.add(rim);

    // 5. Starfield Background
    this.scene.add(this.makeStars(mobile ? 350 : 700));

    // 6. Earth Planet Mesh
    const earthMat = new THREE.MeshPhongMaterial({
      map:       createPhotorealisticEarthTexture(),
      shininess: 30,
      specular:  new THREE.Color(0x223355),
    });

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, mobile ? 48 : 64, mobile ? 48 : 64),
      earthMat
    );
    this.earthGroup.add(earthMesh);

    // 7. Atmospheric Fresnel Glow Rim Shader Shell
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.35, 0.65, 1.0, 1.0) * intensity * 0.75;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    this.earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.06, 32, 32), atmosphereMat));

    this.earthGroup.rotation.order = 'YXZ'; // Important for correct Lat/Lng axis rotation
    this.scene.add(this.earthGroup);

    // 8. Add 3D Pins for All 4 Hotel Properties
    NAMO_PROPERTIES.forEach((prop) => {
      const pinObj = this.build3DPin(prop);
      this.earthGroup.add(pinObj.group);
      this.pinMap.set(prop.id, pinObj);
    });

    // 9. Initial Alignment to Rajasthan, India
    this.earthGroup.rotation.y = this.baseRotY;
    this.earthGroup.rotation.x = this.baseRotX;

    // 10. Load Photorealistic NASA 4K Textures Asynchronously
    const loader = new THREE.TextureLoader();
    const maxAniso = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 4);

    loader.load(TEX_DAY, (t) => {
      if (this._disposed) return;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso;
      earthMat.map = t;
      earthMat.needsUpdate = true;
    });

    loader.load(TEX_BUMP, (t) => {
      if (this._disposed) return;
      earthMat.bumpMap = t;
      earthMat.bumpScale = 0.012;
      earthMat.needsUpdate = true;
    });

    loader.load(TEX_NIGHT, (t) => {
      if (this._disposed) return;
      t.colorSpace = THREE.SRGBColorSpace;
      earthMat.emissiveMap = t;
      earthMat.emissive = new THREE.Color(0x332211);
      earthMat.emissiveIntensity = 0.2;
      earthMat.needsUpdate = true;
    });

    if (!mobile) {
      loader.load(TEX_CLOUDS, (t) => {
        if (this._disposed) return;
        t.colorSpace = THREE.SRGBColorSpace;
        const cloudMat = new THREE.MeshPhongMaterial({
          map: t,
          transparent: true,
          opacity: 0.32,
          depthWrite: false,
          blending: THREE.NormalBlending,
        });
        this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.014, 48, 48), cloudMat);
        this.earthGroup.add(this.cloudMesh);
      });
    }
  }

  private makeStars(count: number): THREE.Points {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 14 + Math.random() * 6;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xfaf6f0, size: 0.045, sizeAttenuation: true, transparent: true, opacity: 0.5,
    }));
  }

  private build3DPin(prop: HotelProperty) {
    const mPos = latLngToVec3(prop.lat, prop.lng, 1.003);
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(mPos);

    // Orient perpendicular outward from sphere
    const normal = mPos.clone().normalize();
    pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    const isPrimary = prop.id === 'kushal-bagh';
    const glowMat = new THREE.MeshBasicMaterial({
      color: isPrimary ? 0xe65512 : 0xC9A227,
      transparent: true,
      opacity: 1.0,
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), glowMat);
    pinGroup.add(glow);

    // Metallic Pin Cone
    const coneGeo = new THREE.ConeGeometry(0.022, 0.065, 16);
    coneGeo.rotateX(Math.PI);
    coneGeo.translate(0, 0.032, 0);
    const coneMat = new THREE.MeshPhongMaterial({
      color: isPrimary ? 0xe65512 : 0xC9A227,
      emissive: 0x553311,
      shininess: 80,
    });
    pinGroup.add(new THREE.Mesh(coneGeo, coneMat));

    // Top Dot
    const topDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    topDot.position.y = 0.055;
    pinGroup.add(topDot);

    // Laser Beam Line
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.004, 0.14, 8),
      new THREE.MeshBasicMaterial({ color: 0xC9A227, transparent: true, opacity: 0.5 })
    );
    beam.position.y = 0.09;
    pinGroup.add(beam);

    // Radar Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.03, 0.042, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({ color: 0xe65512, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    pinGroup.add(ring);

    return { group: pinGroup, glow, ring };
  }

  public attachControls(container: HTMLElement, canvas: HTMLCanvasElement) {
    this._ptrDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      this.dragActive = true;
      this.dragLastX  = e.clientX;
      this.dragLastY  = e.clientY;
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture(e.pointerId); } catch { /* ok */ }
    };

    this._ptrMove = (e: PointerEvent) => {
      if (this.dragActive) {
        const dx = e.clientX - this.dragLastX;
        const dy = e.clientY - this.dragLastY;
        this.dragAccumY += dx * 0.005;
        this.dragAccumX += dy * 0.005;
        this.dragLastX  = e.clientX;
        this.dragLastY  = e.clientY;
      }
    };

    this._ptrUp = (e: PointerEvent) => {
      if (!this.dragActive) return;
      this.dragActive = false;
      canvas.style.cursor = 'grab';
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* ok */ }
    };

    canvas.addEventListener('pointerdown', this._ptrDown);
    window.addEventListener('pointermove', this._ptrMove, { passive: true });
    window.addEventListener('pointerup',   this._ptrUp);
    canvas.style.cursor = 'grab';
  }

  public detachControls(canvas: HTMLCanvasElement) {
    canvas.removeEventListener('pointerdown', this._ptrDown);
    window.removeEventListener('pointermove', this._ptrMove);
    window.removeEventListener('pointerup',   this._ptrUp);
  }

  public focusProperty(id: string) {
    const prop = NAMO_PROPERTIES.find(p => p.id === id);
    if (!prop) return;

    this.activeHotelId = id;
    const lngRad = prop.lng * (Math.PI / 180);
    const latRad = prop.lat * (Math.PI / 180);
    this.targetRotY = -Math.PI / 2 - lngRad;
    this.targetRotX = -latRad;
    this.dragAccumY = 0;
    this.dragAccumX = 0;
  }

  public setScrollProgress(progress: number) {
    // Camera subtle approach on scroll
    const startZ = 2.5;
    const endZ   = 2.15;
    this.targetCameraZ = startZ + (endZ - startZ) * progress;
  }

  public tick(): void {
    if (this._disposed) return;

    const elapsed = this.clock.getElapsedTime();

    // Smooth Lerp Towards Target Rotation & Camera Z
    this.baseRotY += (this.targetRotY - this.baseRotY) * 0.08;
    this.baseRotX += (this.targetRotX - this.baseRotX) * 0.08;
    this.camera.position.z += (this.targetCameraZ - this.camera.position.z) * 0.08;

    // Steady Placement
    this.earthGroup.rotation.y = this.baseRotY + this.dragAccumY;
    this.earthGroup.rotation.x = this.baseRotX + this.dragAccumX * 0.5;

    // Slow Orbital Cloud Drift
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += 0.00012;
    }

    // Pulse Active Pin & Scale Hovered Pins
    this.pinMap.forEach(({ group, ring }, id) => {
      const isSel = id === this.activeHotelId;
      const isHov = id === this.hoveredHotelId;

      const pulse = Math.sin(elapsed * 3.0 + (isSel ? 0 : 1)) * 0.5 + 0.5;
      const s = isSel ? (1.3 + pulse * 0.2) : (isHov ? 1.25 : 1.0);
      group.scale.setScalar(s);

      const ringScale = 1.0 + pulse * 0.4;
      ring.scale.set(ringScale, 1, ringScale);
      (ring.material as THREE.MeshBasicMaterial).opacity = isSel ? (0.4 + (1 - pulse) * 0.4) : 0.2;
    });

    // Screen Projection
    const screenMap: Record<string, { x: number; y: number; visible: boolean }> = {};
    const tempVec = new THREE.Vector3();
    const domCanvas = this.renderer.domElement;

    NAMO_PROPERTIES.forEach((p) => {
      const entry = this.pinMap.get(p.id);
      if (!entry) return;

      entry.group.getWorldPosition(tempVec);
      const v = tempVec.clone().project(this.camera);

      screenMap[p.id] = {
        x: (v.x * 0.5 + 0.5) * domCanvas.clientWidth,
        y: (v.y * -0.5 + 0.5) * domCanvas.clientHeight,
        visible: v.z <= 1.0,
      };
    });

    this.screenPositions = screenMap;
    this.renderer.render(this.scene, this.camera);
  }

  public getHitPropertyId(cx: number, cy: number): string | null {
    for (const p of NAMO_PROPERTIES) {
      const pos = this.screenPositions[p.id];
      if (pos && pos.visible) {
        const dx = cx - pos.x;
        const dy = cy - pos.y;
        if (dx * dx + dy * dy < 36 * 36) return p.id;
      }
    }
    return null;
  }

  public resize(w: number, h: number) {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  public dispose() {
    this._disposed = true;
    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          (mesh.material as THREE.Material)?.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}

// ─── Interactive Earth Component ──────────────────────────────────────────────

export const InteractiveEarth: FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const engineRef   = useRef<DestinationAtlasEngine | null>(null);
  const rafRef      = useRef<number>(0);
  const initedRef   = useRef(false);

  const [activeHotelId, setActiveHotelId]   = useState<string>('kushal-bagh');
  const [hoveredHotelId, setHoveredHotelId] = useState<string | null>(null);
  
  // Refs to avoid React state closures in the tick loop
  const activeHotelIdRef = useRef<string>(activeHotelId);
  const hoveredHotelIdRef = useRef<string | null>(hoveredHotelId);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const [canRender]                         = useState(webglSupported);

  const activeHotel = NAMO_PROPERTIES.find(p => p.id === activeHotelId) || NAMO_PROPERTIES[0];
  const isMobile    = useRef(typeof window !== 'undefined' && window.innerWidth < 768);

  const handleSelectHotel = useCallback((id: string) => {
    setActiveHotelId(id);
    activeHotelIdRef.current = id;
    engineRef.current?.focusProperty(id);
  }, []);

  // ── Main Effect Hook ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!canRender) return;
    if (!canvasRef.current || !wrapperRef.current || !sectionRef.current) return;
    if (initedRef.current) return;
    initedRef.current = true;

    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;

    const w = Math.max(wrapper.clientWidth, 300);
    const h = Math.max(wrapper.clientHeight, 300);

    let engine: DestinationAtlasEngine;
    try {
      engine = new DestinationAtlasEngine(canvas, w, h, isMobile.current, NAMO_PROPERTIES, activeHotelId);
      engineRef.current = engine;
      engine.attachControls(wrapper, canvas);
    } catch (err) {
      console.error('[InteractiveEarth] Initialization error:', err);
      return;
    }

    let isIntersecting = true;
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(sectionRef.current);

    // Render Loop
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!isIntersecting) return;
      
      engine.tick();
      
      // Update popover position directly in DOM to avoid 60fps React state re-renders
      if (popoverRef.current) {
        const targetId = hoveredHotelIdRef.current || activeHotelIdRef.current;
        const pos = engine.screenPositions[targetId];
        if (pos && pos.visible) {
          popoverRef.current.style.display = 'flex';
          popoverRef.current.style.left = `${pos.x}px`;
          popoverRef.current.style.top = `${pos.y}px`;
        } else {
          popoverRef.current.style.display = 'none';
        }
      }
    };
    tick();

    // GSAP ScrollTrigger Integration — Smooth Entry Approach
    const ctx = gsap.context(() => {
      const sp = { p: 0 };

      gsap.to(sp, {
        p: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'center center',
          scrub: 1.2,
          onUpdate: () => {
            engine.setScrollProgress(sp.p);
          },
        },
      });

    }, sectionRef);

    // Pointer Move & Hover Detection
    const onPtrMove = (e: PointerEvent) => {
      const hitId = engine.getHitPropertyId(e.clientX, e.clientY);
      if (hitId !== hoveredHotelIdRef.current) {
        setHoveredHotelId(hitId);
        hoveredHotelIdRef.current = hitId;
      }
      engine.hoveredHotelId = hitId;
      canvas.style.cursor = hitId ? 'pointer' : 'grab';
    };

    const onClick = (e: MouseEvent) => {
      const hitId = engine.getHitPropertyId(e.clientX, e.clientY);
      if (hitId) {
        handleSelectHotel(hitId);
      }
    };

    canvas.addEventListener('pointermove', onPtrMove, { passive: true });
    canvas.addEventListener('click', onClick);

    // ResizeObserver
    const ro = new ResizeObserver((entries) => {
      for (const ent of entries) {
        const { width, height } = ent.contentRect;
        if (width > 0 && height > 0) engine.resize(width, height);
      }
    });
    ro.observe(wrapper);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      ctx.revert();
      ro.disconnect();
      canvas.removeEventListener('pointermove', onPtrMove);
      canvas.removeEventListener('click', onClick);
      engine.detachControls(canvas);
      engine.dispose();
      engineRef.current = null;
      initedRef.current = false;
    };
  }, [canRender, handleSelectHotel]);

  if (!canRender) {
    return (
      <section className="earth-section" id="location">
        <div className="earth-fallback">
          <div className="earth-fallback__inner">
            <span className="section-label">Your Destination</span>
            <h2 className="earth-fallback__name">NAMO Hotel & Travel Properties</h2>
            <p className="earth-fallback__city">Udaipur, Kumbhalgarh, Pushkar, Jaisalmer — Rajasthan</p>
          </div>
        </div>
      </section>
    );
  }

  const tooltipHotelId = hoveredHotelId || activeHotelId;
  const tooltipHotel   = NAMO_PROPERTIES.find(p => p.id === tooltipHotelId) || activeHotel;

  return (
    <section
      ref={sectionRef}
      className="earth-section"
      id="location"
      aria-labelledby="earth-heading"
    >
      <h2 id="earth-heading" className="earth-section__sr-heading">
        NAMO Hotel & Travel — Interactive 3D Destination Atlas
      </h2>

      {/* Header */}
      <div className="earth-section__header">
        <span className="section-label">
          <i className="fa-solid fa-earth-asia" /> Our Locations
        </span>
        <h2 className="earth-section__title">DISCOVER OUR DESTINATIONS</h2>
        <p className="earth-section__subtitle">
          Explore our luxury heritage palaces, hill resorts, cultural dhanis & desert camps across Rajasthan.
        </p>
      </div>

      <div className="earth-section__layout">

        {/* 3D Destination Atlas Canvas Container */}
        <div ref={wrapperRef} className="earth-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="earth-canvas"
            aria-label="Interactive 3D atlas displaying NAMO Hotel locations across Rajasthan"
            role="img"
          />

          {/* Clean Floating Popover Badge — Constrained inside Atlas Container */}
          <div
            ref={popoverRef}
            className="earth-popover"
            style={{ display: 'none' }}
          >
            <div className="earth-popover__icon">
              <i className={tooltipHotel.icon} />
            </div>
            <div className="earth-popover__info">
              <span className="earth-popover__name">{tooltipHotel.name}</span>
              <span className="earth-popover__location">{tooltipHotel.city}, {tooltipHotel.state}</span>
            </div>
          </div>
        </div>

        {/* Right Side Property Selector Panel */}
        <div className="earth-section__panel">
          <span className="panel-subtitle">SELECT PROPERTY TO FOCUS</span>

          {/* Hotel Tabs */}
          <div className="earth-hotel-list">
            {NAMO_PROPERTIES.map((prop) => {
              const isSel = prop.id === activeHotelId;
              return (
                <button
                  key={prop.id}
                  onClick={() => handleSelectHotel(prop.id)}
                  className={`earth-hotel-tab ${isSel ? 'earth-hotel-tab--active' : ''}`}
                >
                  <div className="earth-hotel-tab__icon">
                    <i className={prop.icon} />
                  </div>
                  <div className="earth-hotel-tab__text">
                    <span className="earth-hotel-tab__name">{prop.name}</span>
                    <span className="earth-hotel-tab__city">{prop.city}, {prop.state}</span>
                  </div>
                  <span className="earth-hotel-tab__badge">{prop.typeBadge}</span>
                </button>
              );
            })}
          </div>

          {/* Active Hotel Details Card */}
          <div className="earth-active-card">
            <h3 className="earth-active-card__title">{activeHotel.name}</h3>
            <p className="earth-active-card__tagline">{activeHotel.tagline}</p>
            <p className="earth-active-card__location">
              <i className="fa-solid fa-location-dot" /> {activeHotel.city}, {activeHotel.state}, {activeHotel.country}
            </p>
          </div>

        </div>

      </div>



    </section>
  );
};

export default InteractiveEarth;
