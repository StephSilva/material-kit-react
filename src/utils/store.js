import create from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      usuario: null,
      logeado: false,
      setLogeado: (logeado) => set(() => ({ logeado })),
      setUsuario: (usuario) => set(() => ({ usuario })),
    }),
    { name: "store" }
  )
);
