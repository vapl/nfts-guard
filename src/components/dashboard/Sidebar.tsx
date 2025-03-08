"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import {
  Activity,
  Search,
  Database,
  Wallet,
  Bell,
  Settings,
  PanelLeftClose,
} from "lucide-react";

const Sidebar = () => {
  const { sidebarState, toggleSidebar } = useSidebar();

  const menuItems = [
    { icon: Activity, label: "Overview" },
    { icon: Search, label: "NFT Lookup" },
    { icon: Database, label: "Saved Scans" },
    { icon: Wallet, label: "My Collection" },
    { icon: Bell, label: "Alerts" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside
      className={`h-screen transition-all duration-300 ease-in-out bg-gray-800 text-white ${
        sidebarState === "open" ? "w-64" : "w-20"
      } fixed md:relative z-40`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarState === "open" && (
          <h2 className="text-xl font-bold">NFTs Guard</h2>
        )}
        <button onClick={toggleSidebar}>
          <PanelLeftClose size={24} />
        </button>
      </div>

      <nav className="mt-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-purple-500/20 rounded-lg"
          >
            <item.icon size={20} />
            {sidebarState === "open" && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
