import { PokeStats, PokeStatsSchema } from "@/lib/PokeStatsSchema";
import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

export default function useScanPokeBox(onStats = (stats: PokeStats) => {}) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 750;

    const ctx = canvas.getContext("2d")!;
    ctx.filter =
      "saturate(4) contrast(1.2) hue-rotate(60deg) invert() brightness(2) grayscale() brightness(2.5) contrast(1.5)";

    setCanvas(canvas);
    return () => {
      canvas.remove();
    };
  }, []);

  const scanStats = async (videoFeed: HTMLVideoElement | null) => {
    if (!canvas || !videoFeed) return;

    const ctx = canvas.getContext("2d")!;

    const scaleX = videoFeed.videoWidth / 1280;
    const scaleY = videoFeed.videoHeight / 720;

    ctx.drawImage(
      videoFeed,
      930 * scaleX,
      55 * scaleY,
      280 * scaleX,
      2 * scaleY,
      0,
      0,
      300,
      750
    );
    ctx.drawImage(
      videoFeed,
      940 * scaleX,
      55 * scaleY,
      280 * scaleX,
      35 * scaleY,
      0,
      0,
      350,
      50
    ); // Poke
    ctx.drawImage(
      videoFeed,
      1155 * scaleX,
      15 * scaleY,
      60 * scaleX,
      20 * scaleY,
      0,
      50,
      120,
      40
    ); // Lv.
    ctx.drawImage(
      videoFeed,
      1055 * scaleX,
      142 * scaleY,
      140 * scaleX,
      35 * scaleY,
      0,
      100,
      200,
      50
    ); // HP
    ctx.drawImage(
      videoFeed,
      1140 * scaleX,
      220 * scaleY,
      50 * scaleX,
      35 * scaleY,
      0,
      150,
      80,
      50
    ); // Attack
    ctx.drawImage(
      videoFeed,
      1140 * scaleX,
      295 * scaleY,
      50 * scaleX,
      35 * scaleY,
      0,
      200,
      80,
      50
    ); // Defense
    ctx.drawImage(
      videoFeed,
      930 * scaleX,
      220 * scaleY,
      50 * scaleX,
      35 * scaleY,
      0,
      250,
      80,
      50
    ); // SP Attack
    ctx.drawImage(
      videoFeed,
      930 * scaleX,
      295 * scaleY,
      50 * scaleX,
      35 * scaleY,
      0,
      300,
      80,
      50
    ); // SP Defense
    ctx.drawImage(
      videoFeed,
      1055 * scaleX,
      345 * scaleY,
      50 * scaleX,
      35 * scaleY,
      0,
      350,
      80,
      50
    ); // Speed

    ctx.drawImage(
      videoFeed,
      970 * scaleX,
      385 * scaleY,
      280 * scaleX,
      35 * scaleY,
      0,
      400,
      340,
      40
    ); // Ability
    ctx.drawImage(
      videoFeed,
      848 * scaleX,
      55 * scaleY,
      280 * scaleX,
      35 * scaleY,
      0,
      450,
      340,
      50
    ); // Held Item header
    ctx.drawImage(
      videoFeed,
      970 * scaleX,
      425 * scaleY,
      280 * scaleX,
      35 * scaleY,
      50,
      450,
      340,
      50
    ); // Held Item

    ctx.drawImage(
      videoFeed,
      880 * scaleX,
      465 * scaleY,
      280 * scaleX,
      35 * scaleY,
      0,
      500,
      340,
      50
    ); // Move1
    ctx.drawImage(
      videoFeed,
      880 * scaleX,
      505 * scaleY,
      280 * scaleX,
      35 * scaleY,
      0,
      550,
      340,
      50
    ); // Move2
    ctx.drawImage(
      videoFeed,
      880 * scaleX,
      545 * scaleY,
      280 * scaleX,
      35 * scaleY,
      0,
      600,
      340,
      50
    ); // Move2
    ctx.drawImage(
      videoFeed,
      880 * scaleX,
      585 * scaleY,
      280 * scaleX,
      35 * scaleY,
      0,
      650,
      340,
      50
    ); // Move2

    ctx.drawImage(
      videoFeed,
      1026 * scaleX,
      100 * scaleY,
      80 * scaleX,
      35 * scaleY,
      10,
      700,
      120,
      50
    ); // Tera1
    ctx.drawImage(
      videoFeed,
      1163 * scaleX,
      100 * scaleY,
      80 * scaleX,
      35 * scaleY,
      140,
      700,
      120,
      50
    ); // Tera2

    const { data } = await Tesseract.recognize(canvas);
    const trimmed = data.text
      .trim()
      .split("\n")
      .filter((s) => s.length)
      .map((s) => s.trim());

    if (!trimmed.length) {
      console.log("Failed to parse, are you on the right screen?");
      return;
    }

    const teraIndex = trimmed.length - 1;

    const stats: PokeStats = {
      name: trimmed[0],
      tera: trimmed[teraIndex]
        .split(" ")
        .reverse()[0]
        .replace(/[^A-Z]/g, ""),
      level: trimmed[1].slice(4),
      hp: trimmed[2].split("/")[1],
      attack: trimmed[3],
      defense: trimmed[4],
      spatk: trimmed[5],
      spdef: trimmed[6],
      speed: trimmed[7],
      ability: trimmed[8],
      item: trimmed[9].slice(4),
      move1: "—",
      move2: "—",
      move3: "—",
      move4: "—",
    };

    for (let i = 10; i < teraIndex; i++) {
      stats[`move${i - 9}` as keyof PokeStats] = trimmed[i].trim();
    }

    onStats(stats);
  };

  return scanStats;
}
