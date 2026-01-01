import { useCallback, useRef, useState } from 'react';

interface PhotoAlbum {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  gradientClass: string;
}

export const useVideoExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const createSlideshow = useCallback(async (
    photos: PhotoAlbum[],
    onProgress?: (progress: number) => void
  ): Promise<Blob | null> => {
    if (photos.length === 0) return null;
    
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Create canvas for rendering frames
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d')!;
      canvasRef.current = canvas;

      // Check for MediaRecorder support
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : 'video/webm';
      
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          setIsExporting(false);
          setExportProgress(100);
          resolve(blob);
        };

        mediaRecorder.start();

        const renderSlideshow = async () => {
          const frameDuration = 3000; // 3 seconds per slide
          const transitionDuration = 500; // 0.5 second transition
          const fps = 30;
          const framesPerSlide = (frameDuration / 1000) * fps;
          const transitionFrames = (transitionDuration / 1000) * fps;

          // Intro slide
          await renderIntroSlide(ctx, canvas, fps);
          
          for (let i = 0; i < photos.length; i++) {
            const photo = photos[i];
            const progress = ((i + 1) / photos.length) * 100;
            setExportProgress(progress);
            onProgress?.(progress);

            // Load image if exists
            let img: HTMLImageElement | null = null;
            if (photo.imageUrl) {
              img = await loadImage(photo.imageUrl);
            }

            // Render slide frames
            for (let frame = 0; frame < framesPerSlide; frame++) {
              const opacity = frame < transitionFrames 
                ? frame / transitionFrames 
                : frame > framesPerSlide - transitionFrames 
                  ? (framesPerSlide - frame) / transitionFrames 
                  : 1;

              renderSlide(ctx, canvas, photo, img, opacity);
              await new Promise(r => setTimeout(r, 1000 / fps));
            }
          }

          // Outro slide
          await renderOutroSlide(ctx, canvas, fps);

          mediaRecorder.stop();
        };

        renderSlideshow();
      });
    } catch (error) {
      console.error('Video export failed:', error);
      setIsExporting(false);
      return null;
    }
  }, []);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const renderSlide = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    photo: PhotoAlbum,
    img: HTMLImageElement | null,
    opacity: number
  ) => {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0f1c');
    gradient.addColorStop(1, '#1a1f2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = opacity;

    // Image or gradient background
    if (img) {
      const scale = Math.max(canvas.width / img.width, (canvas.height * 0.5) / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvas.width - w) / 2;
      const y = 200;
      ctx.drawImage(img, x, y, w, h);
    } else {
      // Gradient placeholder
      const photoGradient = ctx.createLinearGradient(0, 200, canvas.width, 800);
      photoGradient.addColorStop(0, '#3b82f6');
      photoGradient.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = photoGradient;
      ctx.fillRect(100, 200, canvas.width - 200, 600);
    }

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(photo.title, canvas.width / 2, canvas.height - 400);

    // Description
    ctx.font = '36px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const maxWidth = canvas.width - 200;
    wrapText(ctx, photo.description, canvas.width / 2, canvas.height - 300, maxWidth, 50);

    // Year badge
    ctx.font = 'bold 48px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('2025', canvas.width / 2, canvas.height - 150);

    ctx.globalAlpha = 1;
  };

  const renderIntroSlide = async (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    fps: number
  ) => {
    const duration = 2000;
    const frames = (duration / 1000) * fps;

    for (let frame = 0; frame < frames; frame++) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0f1c');
      gradient.addColorStop(1, '#1a1f2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 120px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('RETROSPECTIVA', canvas.width / 2, canvas.height / 2 - 50);
      
      ctx.font = 'bold 200px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('2025', canvas.width / 2, canvas.height / 2 + 150);

      await new Promise(r => setTimeout(r, 1000 / fps));
    }
  };

  const renderOutroSlide = async (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    fps: number
  ) => {
    const duration = 2000;
    const frames = (duration / 1000) * fps;

    for (let frame = 0; frame < frames; frame++) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0f1c');
      gradient.addColorStop(1, '#1a1f2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 180px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2026', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '48px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Feliz Ano Novo!', canvas.width / 2, canvas.height / 2 + 100);

      await new Promise(r => setTimeout(r, 1000 / fps));
    }
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  const downloadVideo = useCallback(async (blob: Blob, filename: string = 'retrospectiva-2025.webm') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const shareVideo = useCallback(async (blob: Blob, title: string = 'Minha Retrospectiva 2025') => {
    if (navigator.share && navigator.canShare({ files: [new File([blob], 'retrospectiva.webm', { type: 'video/webm' })] })) {
      try {
        await navigator.share({
          title,
          text: 'Confira minha retrospectiva de 2025! 🎉',
          files: [new File([blob], 'retrospectiva-2025.webm', { type: 'video/webm' })],
        });
        return true;
      } catch (error) {
        console.log('Share cancelled');
        return false;
      }
    }
    return false;
  }, []);

  return {
    isExporting,
    exportProgress,
    createSlideshow,
    downloadVideo,
    shareVideo,
  };
};
