import { z } from "zod";

export const PokeStatsSchema = z.object({
  name: z.string(),
  tera: z.string(),
  level: z.string(),
  hp: z.string(),
  attack: z.string(),
  defense: z.string(),
  spatk: z.string(),
  spdef: z.string(),
  speed: z.string(),
  ability: z.string(),
  item: z.string(),
  move1: z.string(),
  move2: z.string(),
  move3: z.string(),
  move4: z.string(),
});

export type PokeStats = z.infer<typeof PokeStatsSchema>;
