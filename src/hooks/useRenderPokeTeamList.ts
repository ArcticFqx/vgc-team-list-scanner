import { useEffect, useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { PokeStatsSchema, type PokeStats } from "@/lib/PokeStatsSchema";

const url = "./team-list.pdf";

export default function useRenderPokeTeamList() {
  const [iframe, setIframe] = useState<HTMLIFrameElement>();

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    document.body.appendChild(iframe);
    setIframe(iframe);
    return () => {
      iframe.remove();
    };
  }, []);

  const exportPdf = async (statList: PokeStats[]) => {
    const pdfOriginal = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfOriginal);
    const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const leftOrder: (keyof PokeStats)[] = [
      "name",
      "tera",
      "ability",
      "item",
      "move1",
      "move2",
      "move3",
      "move4",
    ] as const;

    const rightOrder: (keyof PokeStats)[] = [
      "level",
      "hp",
      "attack",
      "defense",
      "spatk",
      "spdef",
      "speed",
    ] as const;

    statList[0][rightOrder[0]];

    const boxPositions = [
      { x: 0, y: 0 },
      { x: 280, y: 0 },
      { x: 0, y: -198 },
      { x: 280, y: -198 },
      { x: 0, y: -395 },
      { x: 280, y: -395 },
    ] as const;

    for (let i = 0; i < 6; i++) {
      const box = boxPositions[i];
      const stats = PokeStatsSchema.parse(statList[i]);
      pages.forEach((page) => {
        leftOrder.forEach((idx, j) => {
          page.drawText(stats[idx], {
            x: 90 + box.x,
            y: 652 - j * 23.4 + box.y,
            size: 12,
            font: helvetica,
          });
        });
      });
      rightOrder.forEach((idx, j) => {
        pages[0].drawText(stats[idx], {
          x: 252 + box.x,
          y: 628 - j * 23.4 + box.y,
          size: 12,
          font: helvetica,
        });
      });
    }

    const pdfBytes = await pdfDoc.save();
    const file = new Blob([pdfBytes], {
      type: "application/pdf",
    });

    return new Promise<void>((resolve) => {
      const fileURL = URL.createObjectURL(file);
      iframe!.src = fileURL;

      iframe!.onload = () => {
        iframe!.contentWindow!.print();
        URL.revokeObjectURL(fileURL);
        resolve();
      };
    });
  };

  return exportPdf;
}
