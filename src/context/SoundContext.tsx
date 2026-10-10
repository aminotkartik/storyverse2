import { createContext, useContext, type ReactNode } from "react";
import { useSoundController, type SoundApi } from "../hooks/useSound";

const SoundContext = createContext<SoundApi | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const sound = useSoundController();
  return <SoundContext.Provider value={sound}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundApi {
  const sound = useContext(SoundContext);
  if (!sound) throw new Error("useSound must be used inside <SoundProvider>");
  return sound;
}
