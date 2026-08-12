/**
 * EarthControls.ts
 * Handles all interaction with the Earth globe:
 *   - Cursor parallax (desktop)
 *   - Mouse drag / inertia
 *   - Touch drag (mobile)
 *   - Device orientation (mobile, optional)
 *
 * All high-frequency state is kept outside React to avoid re-renders.
 * The EarthScene reads targetRotation / dragDelta each animation frame.
 */

import { startOrientationListener } from './deviceOrientation';

export interface ControlState {
  /** Target rotation driven by cursor parallax (radians) */
  cursorTargetX: number;
  cursorTargetY: number;
  /** Smoothed cursor rotation applied to mesh (lerped toward target) */
  cursorX: number;
  cursorY: number;

  /** Accumulated drag rotation (radians) — additive on top of idle rotation */
  dragX: number;
  dragY: number;
  /** Drag velocity for inertia */
  dragVelX: number;
  dragVelY: number;

  /** Device orientation tilt (normalized [-1,1]) */
  orientationX: number;
  orientationY: number;
  orientOrientX: number;
  orientOrientY: number;

  isDragging: boolean;
  /** True if any interaction happened (suppresses idle auto-rotation briefly) */
  lastInteractionTime: number;
}

export interface ControlOptions {
  /** Sensitivity for cursor parallax — how much cursor movement tilts globe */
  cursorSensitivity?: number;
  /** Lerp factor for cursor smoothing (0=no follow, 1=instant) */
  cursorLerp?: number;
  /** Sensitivity for drag rotation */
  dragSensitivity?: number;
  /** Inertia decay per frame (0=no decay, 1=instant stop) */
  inertiaDamping?: number;
  /** Sensitivity for device orientation */
  orientationSensitivity?: number;
  /** Container element to attach events to */
  container: HTMLElement;
  /** Canvas element (used for pointer capture) */
  canvas: HTMLCanvasElement;
  /** prefers-reduced-motion: disable animations if true */
  reducedMotion?: boolean;
}

export class EarthControls {
  private state: ControlState;
  private opts: Required<ControlOptions>;
  private cleanupOrientation: (() => void) | null = null;

  // Pointer drag tracking
  private pointerDown = false;
  private lastPointerX = 0;
  private lastPointerY = 0;

  // Touch drag tracking
  private lastTouchX = 0;
  private lastTouchY = 0;
  private touchActive = false;

  // Bound event handlers (for cleanup)
  private _onPointerMove: (e: PointerEvent) => void;
  private _onPointerDown: (e: PointerEvent) => void;
  private _onPointerUp:   (e: PointerEvent) => void;
  private _onTouchStart:  (e: TouchEvent)   => void;
  private _onTouchMove:   (e: TouchEvent)   => void;
  private _onTouchEnd:    (e: TouchEvent)   => void;

  constructor(options: ControlOptions) {
    this.opts = {
      cursorSensitivity:    options.cursorSensitivity    ?? 0.3,
      cursorLerp:           options.cursorLerp           ?? 0.04,
      dragSensitivity:      options.dragSensitivity      ?? 0.007,
      inertiaDamping:       options.inertiaDamping       ?? 0.92,
      orientationSensitivity: options.orientationSensitivity ?? 0.15,
      container:            options.container,
      canvas:               options.canvas,
      reducedMotion:        options.reducedMotion        ?? false,
    };

    this.state = {
      cursorTargetX: 0, cursorTargetY: 0,
      cursorX: 0,       cursorY: 0,
      dragX: 0,         dragY: 0,
      dragVelX: 0,      dragVelY: 0,
      orientationX: 0,  orientationY: 0,
      orientOrientX: 0, orientOrientY: 0,
      isDragging: false,
      lastInteractionTime: 0,
    };

    // Bind handlers
    this._onPointerMove = this.onPointerMove.bind(this);
    this._onPointerDown = this.onPointerDown.bind(this);
    this._onPointerUp   = this.onPointerUp.bind(this);
    this._onTouchStart  = this.onTouchStart.bind(this);
    this._onTouchMove   = this.onTouchMove.bind(this);
    this._onTouchEnd    = this.onTouchEnd.bind(this);

    this.attachEvents();
  }

  private attachEvents(): void {
    const { container, canvas } = this.opts;

    // Cursor parallax — listen on container
    container.addEventListener('pointermove', this._onPointerMove, { passive: true });

    // Drag — listen on canvas
    canvas.addEventListener('pointerdown', this._onPointerDown);
    window.addEventListener('pointermove', this._onPointerMove, { passive: true });
    window.addEventListener('pointerup',   this._onPointerUp);

    // Touch
    canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  this._onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   this._onTouchEnd,   { passive: true });
  }

  /** Attach device orientation (call after permission is granted) */
  public attachOrientation(): void {
    if (this.cleanupOrientation) return; // already attached
    this.cleanupOrientation = startOrientationListener((_alpha, beta, gamma) => {
      // Smooth orientation with lerp
      this.state.orientationX = gamma; // left/right tilt
      this.state.orientationY = beta;  // forward/back tilt
    });
  }

  /** Detach device orientation listener */
  public detachOrientation(): void {
    if (this.cleanupOrientation) {
      this.cleanupOrientation();
      this.cleanupOrientation = null;
    }
  }

  // ─── Pointer (cursor parallax + drag) ─────────────────────────────────────

  private onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    this.pointerDown = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.state.isDragging = true;
    this.state.dragVelX = 0;
    this.state.dragVelY = 0;
    this.opts.canvas.style.cursor = 'grabbing';
    this.opts.canvas.setPointerCapture(e.pointerId);
  }

  private onPointerMove(e: PointerEvent): void {
    const { container, cursorSensitivity, dragSensitivity } = this.opts;
    const rect = container.getBoundingClientRect();

    // Cursor parallax (normalized -1 to 1 from center)
    const nx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
    const ny = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
    this.state.cursorTargetX = ny * cursorSensitivity;
    this.state.cursorTargetY = nx * cursorSensitivity;

    // Drag
    if (this.pointerDown) {
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.state.dragVelY = dx * dragSensitivity;
      this.state.dragVelX = dy * dragSensitivity;
      this.state.dragY += this.state.dragVelY;
      this.state.dragX += this.state.dragVelX;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.state.lastInteractionTime = Date.now();
    }
  }

  private onPointerUp(e: PointerEvent): void {
    if (!this.pointerDown) return;
    this.pointerDown = false;
    this.state.isDragging = false;
    this.opts.canvas.style.cursor = 'grab';
    try { this.opts.canvas.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
  }

  // ─── Touch ────────────────────────────────────────────────────────────────

  private onTouchStart(e: TouchEvent): void {
    if (e.touches.length !== 1) return;
    // Only prevent default if touch is inside canvas to avoid hijacking page scroll
    this.touchActive = true;
    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchY = e.touches[0].clientY;
    this.state.isDragging = true;
    this.state.dragVelX = 0;
    this.state.dragVelY = 0;
  }

  private onTouchMove(e: TouchEvent): void {
    if (!this.touchActive || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - this.lastTouchX;
    const dy = e.touches[0].clientY - this.lastTouchY;

    // Only prevent scroll if horizontal drag is dominant (rotating globe)
    if (Math.abs(dx) > Math.abs(dy) * 1.2) {
      e.preventDefault();
    }

    this.state.dragVelY = dx * this.opts.dragSensitivity;
    this.state.dragVelX = dy * this.opts.dragSensitivity;
    this.state.dragY += this.state.dragVelY;
    this.state.dragX += this.state.dragVelX;
    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchY = e.touches[0].clientY;
    this.state.lastInteractionTime = Date.now();
  }

  private onTouchEnd(_e: TouchEvent): void {
    this.touchActive = false;
    this.state.isDragging = false;
  }

  // ─── Per-frame update (called from animation loop) ────────────────────────

  /**
   * Advance control smoothing. Call once per animation frame.
   * Returns the computed rotation offsets to apply to the Earth mesh.
   */
  public update(): { rotX: number; rotY: number } {
    const s = this.state;
    const { cursorLerp, inertiaDamping, orientationSensitivity } = this.opts;

    // Cursor smooth lerp
    s.cursorX += (s.cursorTargetX - s.cursorX) * cursorLerp;
    s.cursorY += (s.cursorTargetY - s.cursorY) * cursorLerp;

    // Orientation smooth lerp
    s.orientOrientX += (s.orientationX - s.orientOrientX) * 0.05;
    s.orientOrientY += (s.orientationY - s.orientOrientY) * 0.05;

    // Inertia decay when not dragging
    if (!s.isDragging) {
      s.dragVelX *= inertiaDamping;
      s.dragVelY *= inertiaDamping;
      s.dragX += s.dragVelX;
      s.dragY += s.dragVelY;
    }

    // Combine cursor parallax + drag + orientation
    const rotX = s.cursorX + s.dragX + s.orientOrientY * orientationSensitivity;
    const rotY = s.cursorY + s.dragY + s.orientOrientX * orientationSensitivity;

    return { rotX, rotY };
  }

  /** Current drag state (used to suppress idle rotation) */
  public get isDragging(): boolean {
    return this.state.isDragging;
  }

  /** Time since last user interaction (ms) */
  public get timeSinceInteraction(): number {
    return this.state.lastInteractionTime > 0
      ? Date.now() - this.state.lastInteractionTime
      : Infinity;
  }

  /** Dispose all event listeners */
  public dispose(): void {
    const { container, canvas } = this.opts;
    container.removeEventListener('pointermove', this._onPointerMove);
    canvas.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup',   this._onPointerUp);
    canvas.removeEventListener('touchstart', this._onTouchStart);
    canvas.removeEventListener('touchmove',  this._onTouchMove);
    canvas.removeEventListener('touchend',   this._onTouchEnd);
    this.detachOrientation();
  }
}
