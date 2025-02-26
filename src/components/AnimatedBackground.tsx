"use client";

import React, { useEffect, useRef } from "react";

export default function MatrixEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const width = (canvas.width = window.innerWidth / 2); // Tikai labā puse
    const height = (canvas.height = window.innerHeight);
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.clearRect(0, 0, width, height); // Nodrošina, ka nav fona

      ctx.fillStyle = "#bb00ff45"; // Ciparu krāsa
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = Math.floor(Math.random() * 10).toString(); // Tikai cipari 0-9
        ctx.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      });
    };

    const interval = setInterval(draw, 70); // Ātrums

    const resize = () => {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-y-0 right-0 w-1/2 h-full overflow-hidden z-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
