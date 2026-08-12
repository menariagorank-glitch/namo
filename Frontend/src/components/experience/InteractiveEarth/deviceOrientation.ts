/**
 * deviceOrientation.ts
 * Abstracts DeviceOrientationEvent permission and normalization.
 *
 * iOS 13+ requires an explicit user gesture to request permission.
 * Android Chrome grants orientation access without a prompt.
 * Desktop browsers typically do not fire these events.
 */

export type OrientationCallback = (alpha: number, beta: number, gamma: number) => void;

/** Whether DeviceOrientationEvent API exists in this browser */
export function isDeviceOrientationSupported(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

/** Whether this browser requires explicit permission (iOS 13+) */
export function requiresOrientationPermission(): boolean {
  return (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
      .requestPermission === 'function'
  );
}

/**
 * Request orientation permission (iOS) and start listening.
 * On Android/Desktop no permission is needed.
 * Returns true if listening started, false if permission denied or unsupported.
 */
export async function requestOrientationPermission(): Promise<boolean> {
  if (!isDeviceOrientationSupported()) return false;

  if (requiresOrientationPermission()) {
    try {
      const permission = await (
        DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
      ).requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  // Android / desktop — permission implicit
  return true;
}

/**
 * Start listening to device orientation.
 * Returns a cleanup function that removes the listener.
 *
 * Values are normalized to [-1, 1]:
 *   alpha — device rotation around Z (compass heading) → not used for tilt
 *   beta  — front/back tilt [-90, 90] → normalized to [-1, 1]
 *   gamma — left/right tilt [-90, 90] → normalized to [-1, 1]
 */
export function startOrientationListener(
  onOrientation: OrientationCallback,
): () => void {
  const handler = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null || e.alpha === null) return;

    // Clamp and normalize
    const beta  = Math.max(-90, Math.min(90, e.beta));
    const gamma = Math.max(-90, Math.min(90, e.gamma));

    const normBeta  = beta  / 90;   // [-1, 1]
    const normGamma = gamma / 90;   // [-1, 1]

    onOrientation(e.alpha, normBeta, normGamma);
  };

  window.addEventListener('deviceorientation', handler, { passive: true });

  return () => {
    window.removeEventListener('deviceorientation', handler);
  };
}
