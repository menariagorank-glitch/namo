import * as THREE from 'three';
import { RAJASTHAN_BOUNDS, RAJASTHAN_DISTRICTS } from './RajasthanDistricts';

export interface AtlasProperty {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

type PinEntry = {
  group: THREE.Group;
  ring: THREE.Mesh;
  beacon: THREE.Mesh;
  labelLift: THREE.Mesh;
};

const ATLAS_BOUNDS = RAJASTHAN_BOUNDS;
const MODEL_WIDTH = 3.5;
const MODEL_DEPTH = 2.85;

export class DestinationAtlasEngine {
  readonly renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private atlasGroup = new THREE.Group();
  private pinMap = new Map<string, PinEntry>();
  private routeLines: THREE.Mesh[] = [];
  private properties: AtlasProperty[];

  private targetCameraZ = 3.35;
  private targetOffset = new THREE.Vector3(0, 0, 0);
  private dragActive = false;
  private dragLastX = 0;
  private dragLastY = 0;
  private dragRotX = 0;
  private dragRotY = 0;
  private targetRotX = -0.18;
  private targetRotY = -0.1;
  private clock = new THREE.Clock();
  private disposed = false;

  public activeHotelId: string;
  public hoveredHotelId: string | null = null;
  public screenPositions: Record<string, { x: number; y: number; visible: boolean }> = {};

  private ptrMove!: (e: PointerEvent) => void;
  private ptrDown!: (e: PointerEvent) => void;
  private ptrUp!: (e: PointerEvent) => void;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    mobile: boolean,
    properties: AtlasProperty[],
    activeHotelId = properties[0]?.id || '',
  ) {
    this.properties = properties;
    this.activeHotelId = activeHotelId;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.4 : 2));
    this.renderer.setSize(width, height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x0a0807, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 2.45, this.targetCameraZ);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new THREE.AmbientLight(0xffe3c4, 1.15));

    const key = new THREE.DirectionalLight(0xfff2dd, 3.2);
    key.position.set(2.8, 4.2, 3.2);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xe65512, 1.5);
    rim.position.set(-3.5, 1.8, -2.4);
    this.scene.add(rim);

    this.scene.add(this.makeParticles(mobile ? 80 : 150));
    this.buildAtlas();
    this.scene.add(this.atlasGroup);
    this.focusProperty(this.activeHotelId);
  }

  private projectPoint(lat: number, lng: number): THREE.Vector3 {
    const nx = (lng - ATLAS_BOUNDS.minLng) / (ATLAS_BOUNDS.maxLng - ATLAS_BOUNDS.minLng);
    const nz = (lat - ATLAS_BOUNDS.minLat) / (ATLAS_BOUNDS.maxLat - ATLAS_BOUNDS.minLat);
    const x = (nx - 0.5) * MODEL_WIDTH;
    const z = (0.5 - nz) * MODEL_DEPTH;
    return new THREE.Vector3(x, 0, z);
  }

  private makeAtlasTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1b2219');
    gradient.addColorStop(0.42, '#7d6036');
    gradient.addColorStop(1, '#241310');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 420; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = 8 + Math.random() * 36;
      ctx.fillStyle = `rgba(255, 228, 176, ${0.012 + Math.random() * 0.028})`;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.28, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(250, 246, 240, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const x = (canvas.width / 8) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const y = (canvas.height / 6) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 4);
    return texture;
  }

  private buildAtlas(): void {
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(MODEL_WIDTH + 0.26, 0.18, MODEL_DEPTH + 0.26, 1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x140d0a,
        roughness: 0.58,
        metalness: 0.2,
      }),
    );
    base.position.y = -0.12;
    this.atlasGroup.add(base);

    const terrainGeo = new THREE.PlaneGeometry(MODEL_WIDTH + 0.08, MODEL_DEPTH + 0.08, 96, 76);
    terrainGeo.rotateX(-Math.PI / 2);
    const pos = terrainGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const ridge = Math.exp(-Math.pow(x - 0.1, 2) * 2.2) * Math.sin((z + 0.4) * 5.2) * 0.035;
      const dunes = Math.sin((x - z) * 8.5) * 0.014 + Math.cos((x + z) * 5.5) * 0.012;
      pos.setY(i, ridge + dunes);
    }
    terrainGeo.computeVertexNormals();

    const terrain = new THREE.Mesh(
      terrainGeo,
      new THREE.MeshStandardMaterial({
        map: this.makeAtlasTexture(),
        color: 0xffffff,
        roughness: 0.82,
        metalness: 0.04,
      }),
    );
    terrain.position.y = 0.02;
    this.atlasGroup.add(terrain);

    this.buildDistrictModel();

    this.addRidgeLine([
      [72.2, 26.9], [72.7, 26.25], [73.1, 25.7], [73.4, 25.15],
      [73.75, 24.65], [74.05, 24.05],
    ]);

    this.properties.forEach((prop) => {
      const pin = this.buildAtlasPin(prop);
      this.pinMap.set(prop.id, pin);
      this.atlasGroup.add(pin.group);
    });

    this.buildRoutes();
  }

  private buildDistrictModel(): void {
    const districtPalette = [0xb98342, 0xa96f37, 0x8f6436, 0xc08a4a, 0x966133];

    RAJASTHAN_DISTRICTS.forEach((ring, index) => {
      const shape = new THREE.Shape();
      ring.forEach(([lng, lat], pointIndex) => {
        const p = this.projectPoint(lat, lng);
        if (pointIndex === 0) shape.moveTo(p.x, -p.z);
        else shape.lineTo(p.x, -p.z);
      });

      const district = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: 0.035,
          bevelEnabled: true,
          bevelThickness: 0.004,
          bevelSize: 0.006,
          bevelSegments: 1,
        }),
        new THREE.MeshStandardMaterial({
          color: districtPalette[index % districtPalette.length],
          roughness: 0.72,
          metalness: 0.08,
          transparent: true,
          opacity: 0.92,
        }),
      );
      district.rotation.x = -Math.PI / 2;
      district.position.y = 0.065 + index * 0.0004;
      this.atlasGroup.add(district);

      const borderPoints = ring.map(([lng, lat]) => {
        const p = this.projectPoint(lat, lng);
        return new THREE.Vector3(p.x, 0.124 + index * 0.0004, p.z);
      });
      const border = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(borderPoints),
        new THREE.LineBasicMaterial({
          color: 0xffd36b,
          transparent: true,
          opacity: index < 3 ? 0.96 : 0.54,
        }),
      );
      this.atlasGroup.add(border);
    });
  }

  private addRidgeLine(points: Array<[number, number]>): void {
    const linePoints = points.map(([lng, lat]) => {
      const p = this.projectPoint(lat, lng);
      return new THREE.Vector3(p.x, 0.105, p.z);
    });
    const curve = new THREE.CatmullRomCurve3(linePoints);
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 80, 0.008, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xf2d37a, transparent: true, opacity: 0.5 }),
    );
    this.atlasGroup.add(mesh);
  }

  private buildRoutes(): void {
    const hub = this.properties[0];
    if (!hub) return;

    const hubPoint = this.projectPoint(hub.lat, hub.lng);
    this.properties.slice(1).forEach((prop) => {
      const target = this.projectPoint(prop.lat, prop.lng);
      const mid = hubPoint.clone().lerp(target, 0.5);
      mid.y = 0.28;
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(hubPoint.x, 0.12, hubPoint.z),
        mid,
        new THREE.Vector3(target.x, 0.12, target.z),
      );
      const route = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.006, 8, false),
        new THREE.MeshBasicMaterial({
          color: 0xe65512,
          transparent: true,
          opacity: 0.42,
        }),
      );
      this.routeLines.push(route);
      this.atlasGroup.add(route);
    });
  }

  private buildAtlasPin(prop: AtlasProperty): PinEntry {
    const point = this.projectPoint(prop.lat, prop.lng);
    const group = new THREE.Group();
    group.position.set(point.x, 0.13, point.z);

    const isPrimary = prop.id === this.properties[0]?.id;
    const color = isPrimary ? 0xe65512 : 0xC9A227;

    const ringGeo = new THREE.RingGeometry(0.07, 0.092, 36);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
      }),
    );
    group.add(ring);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.017, 0.3, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.35, emissive: 0x1b0903 }),
    );
    stem.position.y = 0.14;
    group.add(stem);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.052, 20, 20),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 }),
    );
    beacon.position.y = 0.31;
    group.add(beacon);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 20, 20),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    halo.position.y = 0.31;
    group.add(halo);

    const labelLift = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.42, 6),
      new THREE.MeshBasicMaterial({ color: 0xffd778, transparent: true, opacity: 0.38 }),
    );
    labelLift.position.y = 0.48;
    group.add(labelLift);

    return { group, ring, beacon, labelLift };
  }

  private makeParticles(count: number): THREE.Points {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.8;
      pos[i * 3 + 1] = 0.25 + Math.random() * 2.6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xf6d37d,
        size: 0.025,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.38,
      }),
    );
  }

  public attachControls(_container: HTMLElement, canvas: HTMLCanvasElement) {
    this.ptrDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      this.dragActive = true;
      this.dragLastX = e.clientX;
      this.dragLastY = e.clientY;
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture(e.pointerId); } catch { /* ok */ }
    };

    this.ptrMove = (e: PointerEvent) => {
      if (!this.dragActive) return;
      const dx = e.clientX - this.dragLastX;
      const dy = e.clientY - this.dragLastY;
      this.dragRotY = THREE.MathUtils.clamp(this.dragRotY + dx * 0.003, -0.5, 0.5);
      this.dragRotX = THREE.MathUtils.clamp(this.dragRotX + dy * 0.002, -0.16, 0.2);
      this.dragLastX = e.clientX;
      this.dragLastY = e.clientY;
    };

    this.ptrUp = (e: PointerEvent) => {
      if (!this.dragActive) return;
      this.dragActive = false;
      canvas.style.cursor = 'grab';
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* ok */ }
    };

    canvas.addEventListener('pointerdown', this.ptrDown);
    window.addEventListener('pointermove', this.ptrMove, { passive: true });
    window.addEventListener('pointerup', this.ptrUp);
    canvas.style.cursor = 'grab';
  }

  public detachControls(canvas: HTMLCanvasElement) {
    canvas.removeEventListener('pointerdown', this.ptrDown);
    window.removeEventListener('pointermove', this.ptrMove);
    window.removeEventListener('pointerup', this.ptrUp);
  }

  public focusProperty(id: string) {
    const prop = this.properties.find(p => p.id === id);
    if (!prop) return;

    this.activeHotelId = id;
    const point = this.projectPoint(prop.lat, prop.lng);
    this.targetOffset.set(-point.x * 0.16, 0, -point.z * 0.1);
  }

  public setScrollProgress(progress: number) {
    const startZ = 3.65;
    const endZ = 3.05;
    this.targetCameraZ = startZ + (endZ - startZ) * progress;
  }

  public tick(): void {
    if (this.disposed) return;

    const elapsed = this.clock.getElapsedTime();
    this.camera.position.z += (this.targetCameraZ - this.camera.position.z) * 0.08;
    this.camera.lookAt(0, 0.05, 0);

    this.atlasGroup.rotation.x += ((this.targetRotX + this.dragRotX) - this.atlasGroup.rotation.x) * 0.08;
    this.atlasGroup.rotation.y += ((this.targetRotY + this.dragRotY) - this.atlasGroup.rotation.y) * 0.08;
    this.atlasGroup.position.lerp(this.targetOffset, 0.08);

    this.pinMap.forEach(({ group, ring, beacon, labelLift }, id) => {
      const active = id === this.activeHotelId;
      const hovered = id === this.hoveredHotelId;
      const pulse = Math.sin(elapsed * (active ? 3.2 : 2.2)) * 0.5 + 0.5;
      const scale = active ? 1.12 + pulse * 0.18 : hovered ? 1.18 : 0.92;

      group.scale.setScalar(scale);
      ring.scale.setScalar(active ? 1.2 + pulse * 0.55 : 1 + pulse * 0.18);
      (ring.material as THREE.MeshBasicMaterial).opacity = active ? 0.42 + (1 - pulse) * 0.5 : 0.22;
      (beacon.material as THREE.MeshBasicMaterial).opacity = active ? 1 : 0.72;
      (labelLift.material as THREE.MeshBasicMaterial).opacity = active ? 0.55 : 0.24;
    });

    this.routeLines.forEach((route, index) => {
      const material = route.material as THREE.MeshBasicMaterial;
      material.opacity = 0.28 + Math.sin(elapsed * 1.4 + index) * 0.08;
    });

    const screenMap: Record<string, { x: number; y: number; visible: boolean }> = {};
    const tempVec = new THREE.Vector3();
    const domCanvas = this.renderer.domElement;

    this.pinMap.forEach((entry, id) => {
      entry.beacon.getWorldPosition(tempVec);
      const v = tempVec.clone().project(this.camera);
      screenMap[id] = {
        x: (v.x * 0.5 + 0.5) * domCanvas.clientWidth,
        y: (v.y * -0.5 + 0.5) * domCanvas.clientHeight,
        visible: v.z <= 1.0 && v.x >= -1.2 && v.x <= 1.2 && v.y >= -1.2 && v.y <= 1.2,
      };
    });

    this.screenPositions = screenMap;
    this.renderer.render(this.scene, this.camera);
  }

  public getHitPropertyId(cx: number, cy: number): string | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = cx - rect.left;
    const y = cy - rect.top;

    for (const p of this.properties) {
      const pos = this.screenPositions[p.id];
      if (pos && pos.visible) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        if (dx * dx + dy * dy < 42 * 42) return p.id;
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
    this.disposed = true;
    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh || (obj as THREE.Points).isPoints || (obj as THREE.Line).isLine) {
        const renderable = obj as THREE.Mesh | THREE.Points | THREE.Line;
        renderable.geometry?.dispose();
        if (Array.isArray(renderable.material)) {
          renderable.material.forEach(m => m.dispose());
        } else {
          renderable.material?.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}
