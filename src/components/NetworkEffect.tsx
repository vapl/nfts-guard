"use client";

import { useEffect, useRef } from "react";

export default function BlockchainNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const virtualWidth = 1920;
  const virtualHeight = 1080;
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Palielinām daļiņu skaitu un ātrumu efektam
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 80 }).map(() => ({
        x: Math.random() * virtualWidth,
        y: Math.random() * virtualHeight * 0.8,
        vx: (Math.random() - 0.5) * 0.8, // 🚀 Ātrākas kustības
        vy: (Math.random() - 0.5) * 0.8, // 🚀 Ātrākas kustības
      }));
    }

    canvas.width = virtualWidth;
    canvas.height = virtualHeight;

    function resizeCanvas() {
      const scaleX = window.innerWidth / virtualWidth;
      const scaleY = window.innerHeight / virtualHeight;
      const scale = Math.min(scaleX, scaleY);
      if (canvas) {
        canvas.style.width = `${virtualWidth * scale}px`;
        canvas.style.height = `${virtualHeight * scale}px`;
      }
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(138, 43, 226, 0.5)"; // Spilgtākas līnijas efektam
      ctx.lineWidth = 1.5;

      particlesRef.current.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); // 📌 Lielākas daļiņas
        ctx.fillStyle = "rgba(138, 43, 226, 0.9)";
        ctx.fill();

        particlesRef.current.forEach((p2, j) => {
          if (i !== j) {
            const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (distance < 200) {
              // 📌 Palielināts attālums līnijām
              ctx.globalAlpha = 1 - distance / 200;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });

        // 🚀 Ātrāka un dinamiskāka kustība
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[0]"
    />
  );
}
