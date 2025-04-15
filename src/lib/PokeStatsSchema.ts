import { z } from "zod";

export const PokeStatsSchema = z.object({
  name: z.string().default(""),
  tera: z.string().default(""),
  level: z.string().default(""),
  hp: z.string().default(""),
  attack: z.string().default(""),
  defense: z.string().default(""),
  spatk: z.string().default(""),
  spdef: z.string().default(""),
  speed: z.string().default(""),
  ability: z.string().default(""),
  item: z.string().default("—"),
  move1: z.string().default("—"),
  move2: z.string().default("—"),
  move3: z.string().default("—"),
  move4: z.string().default("—"),
});

export type PokeStats = z.infer<typeof PokeStatsSchema>;
