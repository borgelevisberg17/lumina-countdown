import { useCallback, useRef, useState } from "react";

export type ExportQuality = "720p" | "1080p" | "4k";
export type ExportFormat = "auto" | "webm" | "mp4";
export type TransitionStyle = "fade" | "slide" | "zoom";

export interface ExportSlide {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface ExportOptions {
  quality: ExportQuality;
  format: ExportFormat;
  transition: TransitionStyle;
}

function qualityToSize(q: ExportQuality) {
  switch (q) {
    case "720p":
      return { width: 1280, height: 720, bps: 5_000_000 };
    case "4k":
      return { width: 3840, height: 2160, bps: 20_000_000 };
    case "1080p":
    default:
      return { width: 1920, height: 1080, bps: 8_000_000 };
  }
}

function pickMime(format: ExportFormat) {
  // Prefer higher quality WebM if available.
  const candidates =
    format === "mp4"
      ? ["video/mp4;codecs=avc1", "video/mp4"]
      : format === "webm"
        ? ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]
        : [
            "video/webm;codecs=vp9",
            "video/webm;codecs=vp8",
            "video/webm",
            "video/mp4;codecs=avc1",
            "video/mp4",
          ];

  const supported = candidates.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
  return supported || "video/webm";
}

export const useVideoExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#0a0f1c");
    gradient.addColorStop(1, "#151a28");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  };

  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    img: HTMLImageElement,
    dx: number,
    dy: number,
    scale: number
  ) => {
    const baseScale = Math.max(canvasW / img.width, canvasH / img.height);
    const s = baseScale * scale;
    const w = img.width * s;
    const h = img.height * s;
    const x = (canvasW - w) / 2 + dx;
    const y = (canvasH - h) / 2 + dy;
    ctx.drawImage(img, x, y, w, h);
  };

  const drawCaption = (ctx: CanvasRenderingContext2D, w: number, h: number, caption?: string) => {
    if (!caption || !caption.trim()) return;

    const pad = Math.round(w * 0.06);
    const maxWidth = w - pad * 2;

    ctx.save();
    ctx.font = `600 ${Math.round(w * 0.035)}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Backplate
    const text = caption.trim();
    const lineHeight = Math.round(w * 0.045);

    const lines: string[] = [];
    let line = "";
    for (const word of text.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    const boxH = lines.length * lineHeight + Math.round(lineHeight * 0.8);
    const boxY = h - Math.round(h * 0.16) - boxH / 2;

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    const r = 14;
    const boxW = maxWidth;
    const boxX = (w - boxW) / 2;

    // rounded rect
    ctx.beginPath();
    ctx.moveTo(boxX + r, boxY - boxH / 2);
    ctx.lineTo(boxX + boxW - r, boxY - boxH / 2);
    ctx.quadraticCurveTo(boxX + boxW, boxY - boxH / 2, boxX + boxW, boxY - boxH / 2 + r);
    ctx.lineTo(boxX + boxW, boxY + boxH / 2 - r);
    ctx.quadraticCurveTo(boxX + boxW, boxY + boxH / 2, boxX + boxW - r, boxY + boxH / 2);
    ctx.lineTo(boxX + r, boxY + boxH / 2);
    ctx.quadraticCurveTo(boxX, boxY + boxH / 2, boxX, boxY + boxH / 2 - r);
    ctx.lineTo(boxX, boxY - boxH / 2 + r);
    ctx.quadraticCurveTo(boxX, boxY - boxH / 2, boxX + r, boxY - boxH / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    const startY = boxY - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => {
      ctx.fillText(l, w / 2, startY + i * lineHeight);
    });

    ctx.restore();
  };

  const createSlideshow = useCallback(
    async (slides: ExportSlide[], options: ExportOptions): Promise<Blob | null> => {
      if (slides.length === 0) return null;

      setIsExporting(true);
      setExportProgress(0);

      try {
        const { width, height, bps } = qualityToSize(options.quality);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas não suportado");
        canvasRef.current = canvas;

        const fps = 30;
        const frameDuration = 2500; // ms per slide
        const transitionDuration = 600; // ms
        const framesPerSlide = Math.round((frameDuration / 1000) * fps);
        const transitionFrames = Math.round((transitionDuration / 1000) * fps);

        const mimeType = pickMime(options.format);
        const stream = canvas.captureStream(fps);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: bps,
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        const imgs = await Promise.all(slides.map((s) => loadImage(s.imageUrl)));

        const drawTransitionFrame = (
          current: HTMLImageElement,
          next: HTMLImageElement,
          t: number,
          caption?: string
        ) => {
          drawBackground(ctx, width, height);

          if (options.transition === "fade") {
            ctx.save();
            ctx.globalAlpha = 1 - t;
            drawImageCover(ctx, width, height, current, 0, 0, 1);
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = t;
            drawImageCover(ctx, width, height, next, 0, 0, 1);
            ctx.restore();
          } else if (options.transition === "slide") {
            const dx = Math.round(width * 0.18);
            drawImageCover(ctx, width, height, current, -dx * t, 0, 1);
            drawImageCover(ctx, width, height, next, dx * (1 - t), 0, 1);
          } else {
            // zoom
            drawImageCover(ctx, width, height, current, 0, 0, 1 + 0.04 * (1 - t));
            ctx.save();
            ctx.globalAlpha = t;
            drawImageCover(ctx, width, height, next, 0, 0, 1 + 0.04 * t);
            ctx.restore();
          }

          drawCaption(ctx, width, height, caption);
        };

        const drawStillFrame = (img: HTMLImageElement, caption?: string) => {
          drawBackground(ctx, width, height);
          drawImageCover(ctx, width, height, img, 0, 0, 1);
          drawCaption(ctx, width, height, caption);
        };

        return await new Promise<Blob | null>((resolve) => {
          mediaRecorder.onstop = () => {
            const out = new Blob(chunks, { type: mimeType });
            setIsExporting(false);
            setExportProgress(100);
            resolve(out);
          };

          mediaRecorder.start();

          (async () => {
            for (let i = 0; i < slides.length; i++) {
              const currentImg = imgs[i];
              const nextImg = imgs[(i + 1) % imgs.length];
              const caption = slides[i]?.caption;

              // Still portion
              for (let f = 0; f < framesPerSlide - transitionFrames; f++) {
                drawStillFrame(currentImg, caption);
                await new Promise((r) => setTimeout(r, 1000 / fps));
              }

              // Transition portion
              for (let tf = 0; tf < transitionFrames; tf++) {
                const t = tf / Math.max(1, transitionFrames - 1);
                drawTransitionFrame(currentImg, nextImg, t, caption);
                await new Promise((r) => setTimeout(r, 1000 / fps));
              }

              const progress = Math.round(((i + 1) / slides.length) * 90);
              setExportProgress(progress);
            }

            mediaRecorder.stop();
          })();
        });
      } catch (error) {
        console.error("Video export failed:", error);
        setIsExporting(false);
        return null;
      }
    },
    []
  );

  return {
    isExporting,
    exportProgress,
    createSlideshow,
  };
};
