/**
 * EarthScene.ts
 * Pure Three.js scene — no React, no state management.
 * Designed to be initialized once, updated each animation frame,
 * and fully disposed on component unmount.
 *
 * Visual layers:
 *  1. Stars     — ~800 point particles in a large sphere
 *  2. Earth     — sphere with day/night blended texture + normal map
 *  3. Atmosphere — transparent additive Fresnel rim
 *  4. Clouds    — semi-transparent cloud layer (skipped on mobile)
 *  5. Marker    — glowing dot + pulsing ring + connecting beam
 */

import * as THREE from 'three';
import { EARTH_RADIUS, HotelGlobeConfig, latLngToVector3 } from './earthConfig';

// ─── Texture URLs (NASA public domain via three-globe package CDN) ────────────
const TEX_DAY   = 'https://unpkg.com/three-globe/example/img/earth-day.jpg';
const TEX_NIGHT = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const TEX_CLOUD = 'https://unpkg.com/three-globe/example/img/earth-clouds.png';
const TEX_BUMP  = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

export interface EarthSceneOptions {
  canvas: HTMLCanvasElement;
  config: HotelGlobeConfig;
  reducedMotion?: boolean;
  isMobile?: boolean;
  /** Explicit canvas dimensions (passed from ResizeObserver — guarantees non-zero) */
  width?: number;
  height?: number;
}

export interface MarkerScreenPosition {
  x: number;
  y: number;
  visible: boolean;
}

export class EarthScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private earthGroup: THREE.Group;        // rotates as a whole unit
  private earthMesh: THREE.Mesh;
  private cloudMesh: THREE.Mesh | null = null;
  private atmosphereMesh: THREE.Mesh;
  private markerGroup: THREE.Group;
  private markerGlow: THREE.Mesh;
  private markerRing1: THREE.Mesh;
  private markerRing2: THREE.Mesh;
  private markerBeam: THREE.Mesh;
  private starField: THREE.Points;

  private config: HotelGlobeConfig;
  private isMobile: boolean;
  private reducedMotion: boolean;

  private idleRotationY = 0;
  private baseRotationY = 0;  // set from config in constructor, updated by GSAP via rotateToMarker()
  private clock = new THREE.Clock();
  private markerWorldPos = new THREE.Vector3();

  // Pub: externally readable marker screen position
  public markerScreenPos: MarkerScreenPosition = { x: 0, y: 0, visible: false };

  // Exposed for GSAP animation
  public cameraZ = 2.8;
  public earthOpacity = 1.0;
  public markerOpacity = 0.0;
  public isMarkerReady = false;

  private textureLoader = new THREE.TextureLoader();

  constructor(opts: EarthSceneOptions) {
    this.config       = opts.config;
    this.reducedMotion = opts.reducedMotion ?? false;
    this.isMobile     = opts.isMobile ?? false;

    // ── Renderer ──────────────────────────────────────────────────────────────
    // Use explicit width/height from ResizeObserver — never trust clientWidth if 0
    const initW = (opts.width  && opts.width  > 0) ? opts.width  : (opts.canvas.clientWidth  || 300);
    const initH = (opts.height && opts.height > 0) ? opts.height : (opts.canvas.clientHeight || 300);

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    const maxDpr = this.isMobile ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    this.renderer.setSize(initW, initH);
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Scene ─────────────────────────────────────────────────────────────────
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060404); // very dark warm-tinted space

    // ── Camera ────────────────────────────────────────────────────────────────
    const w = initW;
    const h = initH;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.z = this.cameraZ;

    // ── Lighting ──────────────────────────────────────────────────────────────
    // Ambient: warm fill
    const ambient = new THREE.AmbientLight(0x2a1a0a, 0.8);
    this.scene.add(ambient);

    // Primary sun directional light — positioned to illuminate India's side
    const sun = new THREE.DirectionalLight(0xfff5e8, 2.4);
    sun.position.set(3, 1, 2);
    this.scene.add(sun);

    // Subtle rim light (opposite sun, cool blue — space reflection)
    const rim = new THREE.DirectionalLight(0x1a3050, 0.4);
    rim.position.set(-3, -1, -2);
    this.scene.add(rim);

    // ── Group to hold all Earth objects ───────────────────────────────────────
    this.earthGroup = new THREE.Group();
    this.scene.add(this.earthGroup);

    // ── Stars ─────────────────────────────────────────────────────────────────
    this.starField = this.createStars();
    this.scene.add(this.starField); // stars don't rotate with Earth

    // ── Earth Mesh ────────────────────────────────────────────────────────────
    const segments = this.isMobile ? 48 : 64;
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, segments, segments);

    // Start with a solid base material while textures load
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1a3a6a,
      shininess: 15,
      specular: new THREE.Color(0x1a3060),
    });

    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthGroup.add(this.earthMesh);

    // Load textures asynchronously
    this.loadTextures(earthMat);

    // ── Atmosphere ────────────────────────────────────────────────────────────
    this.atmosphereMesh = this.createAtmosphere();
    this.earthGroup.add(this.atmosphereMesh);

    // ── Marker ────────────────────────────────────────────────────────────────
    const markerPos = latLngToVector3(this.config.latitude, this.config.longitude, EARTH_RADIUS);
    this.markerGroup = new THREE.Group();
    this.markerGroup.position.set(markerPos.x, markerPos.y, markerPos.z);

    // Orient marker to point outward from sphere surface
    this.markerGroup.lookAt(0, 0, 0);
    this.markerGroup.rotateX(Math.PI); // flip so "up" is outward from surface

    const { glow, ring1, ring2, beam } = this.createMarker();
    this.markerGlow  = glow;
    this.markerRing1 = ring1;
    this.markerRing2 = ring2;
    this.markerBeam  = beam;
    this.markerGroup.add(glow, ring1, ring2, beam);
    this.earthGroup.add(this.markerGroup);

    // Store world position for 3D→2D projection
    this.markerGroup.getWorldPosition(this.markerWorldPos);

    // Start transparent — GSAP/scroll will fade in
    this.setMarkerOpacity(0);

    // ── Initial Earth rotation to face India ──────────────────────────────────
    // Start with India in front (before scroll animation begins)
    this.baseRotationY = -this.config.longitude * (Math.PI / 180) + Math.PI;
    this.earthGroup.rotation.y = this.baseRotationY;
  }

  // ─── Texture loading ─────────────────────────────────────────────────────────

  private loadTextures(mat: THREE.MeshPhongMaterial): void {
    // Day texture
    this.textureLoader.load(TEX_DAY, (dayTex) => {
      dayTex.colorSpace = THREE.SRGBColorSpace;
      dayTex.anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 4);
      mat.map = dayTex;
      mat.needsUpdate = true;
    });

    // Bump/topology
    this.textureLoader.load(TEX_BUMP, (bumpTex) => {
      mat.bumpMap = bumpTex;
      mat.bumpScale = 0.015;
      mat.needsUpdate = true;
    });

    // Specular
    this.textureLoader.load(TEX_NIGHT, (nightTex) => {
      nightTex.colorSpace = THREE.SRGBColorSpace;
      mat.emissiveMap = nightTex;
      mat.emissive = new THREE.Color(0x223344);
      mat.emissiveIntensity = 0.06;
      mat.needsUpdate = true;
    });

    // Clouds (desktop only)
    if (!this.isMobile) {
      this.textureLoader.load(TEX_CLOUD, (cloudTex) => {
        cloudTex.colorSpace = THREE.SRGBColorSpace;
        const cloudGeo = new THREE.SphereGeometry(EARTH_RADIUS + 0.012, 48, 48);
        const cloudMat = new THREE.MeshPhongMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
          blending: THREE.NormalBlending,
        });
        this.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        this.earthGroup.add(this.cloudMesh);
      });
    }
  }

  // ─── Atmosphere ──────────────────────────────────────────────────────────────

  private createAtmosphere(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(EARTH_RADIUS + 0.055, 32, 32);
    // Custom Fresnel-like shader for atmospheric rim glow
    const mat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vNormal;
        uniform vec3 uColor;
        uniform float uOpacity;
        void main() {
          // Fresnel rim: bright at grazing angles, transparent in center
          float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.5);
          gl_FragColor = vec4(uColor, intensity * uOpacity);
        }
      `,
      uniforms: {
        uColor:   { value: new THREE.Color(0x6090c0) },  // subtle cool blue rim
        uOpacity: { value: 0.6 },
      },
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Mesh(geo, mat);
  }

  // ─── Stars ───────────────────────────────────────────────────────────────────

  private createStars(): THREE.Points {
    const count = this.isMobile ? 500 : 800;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute uniformly on a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 18 + Math.random() * 5;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0xfaf6f0,       // warm white — matches site's --color-bg
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
    });

    return new THREE.Points(geo, mat);
  }

  // ─── Marker ──────────────────────────────────────────────────────────────────

  private createMarker(): {
    glow: THREE.Mesh;
    ring1: THREE.Mesh;
    ring2: THREE.Mesh;
    beam: THREE.Mesh;
  } {
    // The marker group's local Z axis points AWAY from sphere (outward normal)
    // So "up" in marker space = outward from sphere

    // Glowing central dot
    const glowGeo = new THREE.SphereGeometry(0.018, 12, 12);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xC9A227,   // --color-gold
      transparent: true,
      opacity: 1.0,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 0, -0.01); // slightly above surface (outward)

    // Outer ring 1 — pulsing
    const ring1Geo = new THREE.RingGeometry(0.028, 0.036, 32);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xC9A227,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.position.set(0, 0, -0.012);

    // Outer ring 2 — slower pulse
    const ring2Geo = new THREE.RingGeometry(0.045, 0.052, 32);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xe65512,   // --color-primary saffron
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.set(0, 0, -0.014);

    // Vertical beam (cylinder from surface outward)
    const beamGeo = new THREE.CylinderGeometry(0.002, 0.004, 0.12, 6);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xC9A227,
      transparent: true,
      opacity: 0.5,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 0, -0.08); // center of the beam length
    beam.rotation.x = Math.PI / 2;  // align along local Z (outward)

    return { glow, ring1, ring2, beam };
  }

  // ─── Public: GSAP-friendly setters ───────────────────────────────────────────

  public setMarkerOpacity(opacity: number): void {
    this.markerOpacity = opacity;
    const mats = [
      this.markerGlow.material,
      this.markerRing1.material,
      this.markerRing2.material,
      this.markerBeam.material,
    ] as THREE.MeshBasicMaterial[];

    mats.forEach((m, i) => {
      const base = [1.0, 0.7, 0.35, 0.5][i];
      m.opacity = base * opacity;
    });
  }

  public setCameraZ(z: number): void {
    this.cameraZ = z;
    this.camera.position.z = z;
  }

  /** Rotate the Earth so the marker faces the camera (called by GSAP on scroll) */
  public rotateToMarker(progress: number): void {
    // Interpolate baseRotationY from initial (India roughly left) to 0 (marker at front)
    const startY = -this.config.longitude * (Math.PI / 180) + Math.PI;
    const endY   = 0;
    this.baseRotationY = startY + (endY - startY) * progress;
  }

  // ─── Per-frame update ────────────────────────────────────────────────────────

  /**
   * Update the scene each animation frame.
   * @param controlRotX  — vertical rotation from controls (radians)
   * @param controlRotY  — horizontal rotation from controls (radians)
   * @param isDragging   — suppresses idle rotation when true
   *
   * Rotation model:
   *   earthGroup.rotation.y = baseY + idleOffset + controlRotY
   *   earthGroup.rotation.x = controlRotX * dampening
   *
   * baseY is set by the constructor (face India) and overridden by rotateToMarker().
   * idleOffset accumulates slowly each frame.
   * controlRotY is the combined cursor+drag+orientation from EarthControls.
   */
  public update(controlRotX: number, controlRotY: number, isDragging: boolean): void {
    const elapsed = this.clock.getElapsedTime();

    // Idle rotation (very slow) — suppressed during drag and reduced-motion
    if (!isDragging && !this.reducedMotion) {
      this.idleRotationY += 0.00018; // ~0.6°/s
    }

    // Combine: base (from GSAP or constructor) + idle drift + user control
    this.earthGroup.rotation.y = this.baseRotationY + this.idleRotationY + controlRotY;
    this.earthGroup.rotation.x = controlRotX * 0.5;

    // Cloud slow rotation (independent)
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += 0.00008;
    }

    // Marker pulse (only if visible)
    if (this.markerOpacity > 0.01 && !this.reducedMotion) {
      const pulse = Math.sin(elapsed * 2.2) * 0.5 + 0.5; // 0→1→0
      const scale1 = 1.0 + pulse * 0.25;
      const scale2 = 1.0 + Math.sin(elapsed * 1.4 + 1) * 0.5 * 0.2;

      this.markerRing1.scale.set(scale1, scale1, 1);
      (this.markerRing1.material as THREE.MeshBasicMaterial).opacity =
        (0.3 + (1 - pulse) * 0.4) * this.markerOpacity;

      this.markerRing2.scale.set(scale2, scale2, 1);
      (this.markerRing2.material as THREE.MeshBasicMaterial).opacity =
        (0.15 + (1 - Math.sin(elapsed * 1.4 + 1) * 0.5 + 0.5) * 0.2) * this.markerOpacity;
    }

    // Update marker world position for tooltip projection
    this.markerGroup.getWorldPosition(this.markerWorldPos);
    this.markerScreenPos = this.projectToScreen(this.markerWorldPos);
  }

  /** Render the scene */
  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  // ─── Marker hover ────────────────────────────────────────────────────────────

  public setMarkerHovered(hovered: boolean): void {
    const targetScale = hovered ? 1.6 : 1.0;
    this.markerGlow.scale.setScalar(targetScale);
    (this.markerGlow.material as THREE.MeshBasicMaterial).color.set(
      hovered ? 0xe65512 : 0xC9A227, // saffron on hover, gold default
    );
  }

  // ─── 3D → 2D Screen projection ───────────────────────────────────────────────

  private projectToScreen(worldPos: THREE.Vector3): MarkerScreenPosition {
    const canvas = this.renderer.domElement;
    const vec = worldPos.clone().project(this.camera);

    // Check if behind camera
    if (vec.z > 1.0) return { x: 0, y: 0, visible: false };

    const x = (vec.x  *  0.5 + 0.5) * canvas.clientWidth;
    const y = (vec.y * -0.5 + 0.5) * canvas.clientHeight;

    return { x, y, visible: true };
  }

  // ─── Resize ──────────────────────────────────────────────────────────────────

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ─── Raycasting for marker click/hover detection ──────────────────────────────

  public isPointerOverMarker(clientX: number, clientY: number): boolean {
    if (!this.markerScreenPos.visible) return false;
    const dx = clientX - this.markerScreenPos.x;
    const dy = clientY - this.markerScreenPos.y;
    // Hit area: 40px radius around marker screen position
    return (dx * dx + dy * dy) < 40 * 40;
  }

  // ─── Dispose ─────────────────────────────────────────────────────────────────

  public dispose(): void {
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        if (obj.geometry) obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else if (obj.material) {
          // Dispose textures
          const mat = obj.material as THREE.MeshPhongMaterial;
          mat.map?.dispose();
          mat.bumpMap?.dispose();
          mat.emissiveMap?.dispose();
          (mat as unknown as THREE.MeshBasicMaterial).dispose?.();
          obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
