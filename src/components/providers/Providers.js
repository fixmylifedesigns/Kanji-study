"use client";

import { KanjiProvider } from "@/context/KanjiContext";

export function Providers({ children }) {
  return <KanjiProvider>{children}</KanjiProvider>;
}
