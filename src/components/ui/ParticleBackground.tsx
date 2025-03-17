import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  colorScheme?: 'blue' | 'purple' | 'mixed';
  density?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'medium' | 'fast';
  children?: React.ReactNode;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className,
  particleCount = 30,
  colorScheme = 'blue',
  density = 'medium',
  speed = 'medium',
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // 根据密度调整粒子数量
  const getDensityMultiplier = () => {
    switch (density) {
      case 'low': return 0.5;
      case 'high': return 2;
      default: return 1;
    }
  };

  // 根据速度调整粒子移动速率
  const getSpeedMultiplier = () => {
    switch (speed) {
      case 'slow': return 0.5;
      case 'fast': return 2;
      default: return 1;
    }
  };

  // 根据配色方案获取颜色
  const getParticleColor = () => {
    switch (colorScheme) {
      case 'blue': return `rgba(125, 211, 252, ${Math.random() * 0.5 + 0.3})`;
      case 'purple': return `rgba(192, 132, 252, ${Math.random() * 0.5 + 0.3})`;
      case 'mixed': 
        return Math.random() > 0.5 
          ? `rgba(125, 211, 252, ${Math.random() * 0.5 + 0.3})` 
          : `rgba(192, 132, 252, ${Math.random() * 0.5 + 0.3})`;
      default: return `rgba(125, 211, 252, ${Math.random() * 0.5 + 0.3})`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    // 初始化画布大小
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 创建粒子
    const actualParticleCount = Math.floor(particleCount * getDensityMultiplier());
    particlesRef.current = Array.from({ length: actualParticleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * getSpeedMultiplier(),
      speedY: (Math.random() - 0.5) * getSpeedMultiplier(),
      opacity: Math.random() * 0.5 + 0.3,
      color: getParticleColor()
    }));

    // 动画循环
    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particlesRef.current.forEach(particle => {
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount, colorScheme, density, speed]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParticleBackground;