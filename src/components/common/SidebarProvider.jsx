"use client";

import { createContext, useContext, useState } from "react";

// Create a context to manage sidebar state
const SidebarContext = createContext({
  isExpanded: true,
  toggleSidebar: () => {},
});

export function SidebarProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
