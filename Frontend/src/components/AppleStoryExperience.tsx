import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AppleStoryExperience: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const group = new THREE.Group();
    scene.add(group);

    const particleCount = window.innerWidth < 768 ? 80 : 150;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }

    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)),
      new THREE.PointsMaterial({
        color: 0xc9a227,
        size: 0.028,
        transparent: true,
        opacity: 0.36,
        sizeAttenuation: true,
      }),
    );
    group.add(particles);

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.7 + i * 0.42, 0.0035, 8, 96),
        new THREE.MeshBasicMaterial({
          color: i % 2 ? 0xe65512 : 0xc9a227,
          transparent: true,
          opacity: 0.08,
        }),
      );
      ring.position.set((i - 2) * 0.75, (i % 2 ? -0.55 : 0.45), -1.4 - i * 0.2);
      ring.rotation.x = 1.1;
      ring.rotation.y = -0.35 + i * 0.12;
      rings.push(ring);
      group.add(ring);
    }

    let mouseX = 0;
    let mouseY = 0;
    let scrollProgress = 0;

    const onMove = (event: PointerEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    window.addEventListener('resize', onResize);

    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: self => {
        scrollProgress = self.progress;
      },
    });

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y += ((mouseX * 0.1 + scrollProgress * 0.8) - group.rotation.y) * 0.035;
      group.rotation.x += ((-mouseY * 0.06) - group.rotation.x) * 0.035;
      particles.rotation.y = elapsed * 0.025;

      rings.forEach((ring, index) => {
        ring.rotation.z = elapsed * (0.035 + index * 0.01);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.045 + Math.sin(elapsed * 0.8 + index) * 0.018;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      scrollTrigger.kill();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      scene.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Points).isPoints) {
          const renderable = obj as THREE.Mesh | THREE.Points;
          renderable.geometry?.dispose();
          if (Array.isArray(renderable.material)) renderable.material.forEach(m => m.dispose());
          else renderable.material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="apple-atmosphere-canvas" aria-hidden="true" />;
};

export default AppleStoryExperience;
