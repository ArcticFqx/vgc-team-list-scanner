import { create } from "zustand";
import { PokeStats } from "./PokeStatsSchema";

type PokeStore = {
  pkmnStatsList: PokeStats[];
  setPokeStatsAt: (index: number, stats: PokeStats) => void;
};

export const usePokeStore = create<PokeStore>((set) => ({
  pkmnStatsList: Array(6).fill({}),
  setPokeStatsAt: (index, stats) =>
    set((state) => {
      const newStats = [...state.pkmnStatsList];
      newStats[index] = stats;
      return {
        pkmnStatsList: newStats,
      };
    }),
}));
