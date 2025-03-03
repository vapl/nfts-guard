"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="opacity-0">Loading...</div>;

  const currentTheme = theme === "system" ? resolvedTheme : theme; // ✅ Labojums!

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="px-4 py-2 rounded-full bg-primary text-white"
    >
      {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
