import { useEffect, useState } from "react";
import { PokeStats } from "./useScanPokeBox";
import { PDFDocument, StandardFonts } from "pdf-lib";

const url = "./team-list.pdf";
const pdfOriginal = await fetch(url).then((res) => res.arrayBuffer());

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

  const exportPdf = async (stats: PokeStats) => {
    const pdfDoc = await PDFDocument.load(pdfOriginal);
    const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const leftOrder = [
      "name",
      "tera",
      "ability",
      "item",
      "move1",
      "move2",
      "move3",
      "move4",
    ];
    const rightOrder = [
      "level",
      "hp",
      "attack",
      "defense",
      "spatk",
      "spdef",
      "speed",
    ];

    const leftX = 90;
    const leftY = 652;
    const rightX = 250;
    const rightY = 628;

    pages.forEach((page) => {
      leftOrder.forEach((idx, i) => {
        page.drawText(stats[idx], {
          x: 90,
          y: 652 - i * 23.4,
          size: 12,
          font: helvetica,
        });
      });
    });
    rightOrder.forEach((idx, i) => {
      pages[0].drawText(stats[idx], {
        x: 250,
        y: 628 - i * 23.4,
        size: 12,
        font: helvetica,
      });
    });

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
