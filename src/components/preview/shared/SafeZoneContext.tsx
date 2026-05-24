"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SafeZoneContextValue {
  show: boolean;
  toggle: () => void;
}

const SafeZoneContext = createContext<SafeZoneContextValue>({
  show: false,
  toggle: () => {},
});

export function SafeZoneProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <SafeZoneContext.Provider value={{ show, toggle: () => setShow((s) => !s) }}>
      {children}
    </SafeZoneContext.Provider>
  );
}

export function useSafeZone() {
  return useContext(SafeZoneContext);
}
