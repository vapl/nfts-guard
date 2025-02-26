"use client";

import React from "react";
import { Menu, UserCircle } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-gray-800 text-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Kreisā puse: Hamburger poga */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      {/* Labā puse: Lietotāja profils */}
      <div className="flex items-center gap-4">
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
          Upgrade to Premium
        </button>
        <UserCircle size={32} className="text-gray-300" />
      </div>
    </header>
  );
};

export default Header;
