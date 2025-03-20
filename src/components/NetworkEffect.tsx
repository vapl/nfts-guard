"use client";

import { useEffect, useRef } from "react";

export default function BlockchainNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Palielinām daļiņu skaitu un ātrumu efektam
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 80 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.9,
        vx: (Math.random() - 0.5) * 0.8, // 🚀 Ātrākas kustības
        vy: (Math.random() - 0.5) * 0.8, // 🚀 Ātrākas kustības
      }));
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(137, 43, 226, 0.3)"; // Spilgtākas līnijas efektam
      ctx.lineWidth = 0.8;

      particlesRef.current.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); // 📌 Lielākas daļiņas
        ctx.fillStyle = "rgba(138, 43, 226, 0.9)";
        ctx.fill();

        particlesRef.current.forEach((p2, j) => {
          if (i !== j) {
            const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (distance < 150) {
              // 📌 Palielināts attālums līnijām
              ctx.globalAlpha = 1 - distance / 150;
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
      className="fixed top-0 left-200 w-full h-full object-cover pointer-events-none z-0"
    />
  );
}
