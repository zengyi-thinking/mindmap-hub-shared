import React, { useEffect, useRef, useState } from 'react';
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

interface AnimeCharacter {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  image: HTMLImageElement;
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  colorScheme?: 'blue' | 'purple' | 'mixed';
  density?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'medium' | 'fast';
  showAnimeCharacters?: boolean;
  animeCharacterCount?: number;
  children?: React.ReactNode;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className,
  particleCount = 30,
  colorScheme = 'blue',
  density = 'medium',
  speed = 'medium',
  showAnimeCharacters = false,
  animeCharacterCount = 3,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animeCharactersRef = useRef<AnimeCharacter[]>([]);
  const animationRef = useRef<number>(0);
  const imagesLoadedRef = useRef<boolean>(false);

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

  // 加载动漫角色图片
  const loadAnimeCharacterImages = () => {
    const paimonImage = new Image();
    paimonImage.src = '/mindmap-hub-shared/paimon.svg';
    paimonImage.onload = () => {
      imagesLoadedRef.current = true;
    };
    
    // 同时加载派蒙GIF
    if (paimenGifRef.current) {
      paimenGifRef.current.src = '/mindmap-hub-shared/paimen.gif';
      paimenGifRef.current.onload = () => {
        paimenGifRef.current!.style.display = 'block';
      };
    }
    
    return paimonImage;
  };

  // 添加派蒙GIF动画元素
  const paimenGifRef = useRef<HTMLImageElement | null>(null);
  // 添加鼠标位置状态
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 初始化派蒙GIF元素 - 修复GIF显示问题
    const paimonGifElement = document.createElement('img');
    paimonGifElement.src = '/mindmap-hub-shared/paimen.gif';
    paimonGifElement.alt = '派蒙';
    paimonGifElement.className = 'absolute top-4 right-4 w-20 h-20 z-20 animate-bounce-slow';
    paimonGifElement.style.display = 'none'; // 先隐藏，等加载完成后显示
    paimonGifElement.style.transition = 'transform 0.5s ease-out';
    paimenGifRef.current = paimonGifElement;
    
    // 确保父元素存在后再添加
    if (canvas.parentElement) {
      canvas.parentElement.appendChild(paimonGifElement);
    }

    // 添加鼠标移动事件监听
    const handleMouseMove = (e: MouseEvent) => {
      if (canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
        
        // 让派蒙跟随鼠标，但有一定延迟感
        if (paimenGifRef.current && isInteracting) {
          const gifRect = paimenGifRef.current.getBoundingClientRect();
          const targetX = x - gifRect.width / 2;
          const targetY = y - gifRect.height / 2;
          paimenGifRef.current.style.position = 'absolute';
          paimenGifRef.current.style.left = `${targetX}px`;
          paimenGifRef.current.style.top = `${targetY}px`;
          paimenGifRef.current.style.zIndex = '30';
        }
      }
    };

    // 添加点击事件，让派蒙跟随鼠标
    const handleClick = () => {
      setIsInteracting(!isInteracting);
      if (paimenGifRef.current) {
        if (!isInteracting) {
          // 开始跟随
          paimenGifRef.current.style.transform = 'scale(1.2)';
          paimenGifRef.current.style.cursor = 'grab';
          // 添加提示文字
          const tooltip = document.createElement('div');
          tooltip.textContent = '我会跟着你啦！';
          tooltip.className = 'absolute bg-white px-2 py-1 rounded shadow-md text-xs animate-fade-in';
          tooltip.style.left = `${mousePosition.x}px`;
          tooltip.style.top = `${mousePosition.y - 30}px`;
          tooltip.style.zIndex = '40';
          canvas.parentElement?.appendChild(tooltip);
          setTimeout(() => {
            if (tooltip.parentNode) {
              tooltip.parentNode.removeChild(tooltip);
            }
          }, 2000);
        } else {
          // 停止跟随
          paimenGifRef.current.style.transform = 'scale(1)';
          paimenGifRef.current.style.cursor = 'pointer';
          // 回到原位
          paimenGifRef.current.style.position = 'absolute';
          paimenGifRef.current.style.top = '1rem';
          paimenGifRef.current.style.right = '1rem';
          paimenGifRef.current.style.left = 'auto';
        }
      }
    };

    if (paimenGifRef.current) {
      paimenGifRef.current.style.cursor = 'pointer';
      paimenGifRef.current.addEventListener('click', handleClick);
      paimenGifRef.current.onload = () => {
        paimenGifRef.current!.style.display = 'block'; // 加载完成后显示
      };
    }

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
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

    // 创建动漫角色
    if (showAnimeCharacters) {
      const paimonImage = loadAnimeCharacterImages();
      const speedMultiplier = getSpeedMultiplier() * 0.5; // 角色移动速度较慢
      
      animeCharactersRef.current = Array.from({ length: animeCharacterCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30 + Math.random() * 20, // 角色大小
        speedX: (Math.random() - 0.5) * speedMultiplier,
        speedY: (Math.random() - 0.5) * speedMultiplier,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        image: paimonImage
      }));
    }

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

      // 更新和绘制动漫角色
      if (showAnimeCharacters && imagesLoadedRef.current) {
        animeCharactersRef.current.forEach(character => {
          // 更新位置
          character.x += character.speedX;
          character.y += character.speedY;
          character.rotation += character.rotationSpeed;

          // 边界检查
          if (character.x < 0 || character.x > canvas.width) {
            character.speedX = -character.speedX;
          }
          if (character.y < 0 || character.y > canvas.height) {
            character.speedY = -character.speedY;
          }

          // 绘制角色
          ctx.save();
          ctx.translate(character.x, character.y);
          ctx.rotate(character.rotation);
          ctx.drawImage(
            character.image, 
            -character.size / 2, 
            -character.size / 2, 
            character.size, 
            character.size
          );
          ctx.restore();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      
      // 清理添加的派蒙GIF元素
      if (paimenGifRef.current && paimenGifRef.current.parentNode) {
        paimenGifRef.current.parentNode.removeChild(paimenGifRef.current);
      }
    };
  }, [particleCount, colorScheme, density, speed, showAnimeCharacters, animeCharacterCount]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      {/* 派蒙GIF动画现在通过useEffect中的DOM操作添加 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParticleBackground;