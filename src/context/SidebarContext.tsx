"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Sidebar stāvokļa veidi
export enum SidebarState {
  OPEN = "open",
  COLLAPSED = "collapsed",
  HIDDEN = "hidden",
}

// Konteksta tips
type SidebarContextType = {
  sidebarState: SidebarState;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  hideSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;
  isMobile: boolean;
};

// Izveido kontekstu
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Hook konteksta piekļuvei
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Provider komponente
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>(
    SidebarState.OPEN
  );
  const [isMobile, setIsMobile] = useState(false);

  // Automātiska ekrāna izmēra pārvaldība
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarState(SidebarState.HIDDEN); // Mobilajā sidebar sākumā slēpts
      } else {
        setSidebarState(SidebarState.OPEN); // Desktopā vienmēr atvērts
      }
    };

    handleResize(); // Pārbauda uzreiz ielādes laikā
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Funkcijas pārslēgšanai
  const toggleSidebar = () => {
    setSidebarState((prev) => {
      if (isMobile) {
        // Mobilajā: Open ↔ Hidden
        return prev === SidebarState.HIDDEN
          ? SidebarState.OPEN
          : SidebarState.HIDDEN;
      } else {
        // Desktop: Open ↔ Collapsed
        return prev === SidebarState.OPEN
          ? SidebarState.COLLAPSED
          : SidebarState.OPEN;
      }
    });
  };

  const collapseSidebar = () => setSidebarState(SidebarState.COLLAPSED);
  const hideSidebar = () => setSidebarState(SidebarState.HIDDEN);

  return (
    <SidebarContext.Provider
      value={{
        sidebarState,
        toggleSidebar,
        collapseSidebar,
        hideSidebar,
        setSidebarState,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
