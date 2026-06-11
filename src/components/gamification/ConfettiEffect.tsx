import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  life: number;
  shape: 'rect' | 'circle' | 'triangle';
}

const COLORS = ['#e34628', '#0F3361', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#f472b6'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createParticle(canvasWidth: number): Particle {
  return {
    x: randomBetween(0.2, 0.8) * canvasWidth,
    y: randomBetween(-20, 20),
    vx: randomBetween(-6, 6),
    vy: randomBetween(-18, -8),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: randomBetween(8, 16),
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.15, 0.15),
    gravity: randomBetween(0.3, 0.6),
    life: 1,
    shape: (['rect', 'circle', 'triangle'] as const)[Math.floor(Math.random() * 3)],
  };
}

interface Props {
  active: boolean;
  particleCount?: number;
}

export function ConfettiEffect({ active, particleCount = 120 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn particles in two waves
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(canvas.width)
    );
    setTimeout(() => {
      particlesRef.current.push(
        ...Array.from({ length: Math.floor(particleCount / 2) }, () =>
          createParticle(canvas!.width)
        )
      );
    }, 400);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0 && p.y < canvas.height + 30);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.life -= 0.008;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, particleCount]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
