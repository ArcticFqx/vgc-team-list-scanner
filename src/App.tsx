import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { PDFDocument, StandardFonts } from "pdf-lib";

function App() {
  const [activeDeviceId, setActiveDeviceId] = useState<
    MediaDeviceInfo["deviceId"] | null
  >(null);

  const [stats, setStats] = useState<Record<string, string>>({});

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = mediaDevices.filter(
          (device) => device.kind === "videoinput"
        );
        const found = videoInputs.find((dev) => dev.label.includes("Cam Link"));
        if (found) {
          setActiveDeviceId(found.deviceId);
        }
      } catch (error) {
        console.error("Error getting devices:", error);
      }
    };

    getDevices();
  }, []);

  if (!activeDeviceId) {
    return <div>No cameras detected</div>;
  }

  const onCapture = async () => {
    if (!webcamRef.current || !canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const imageSrc = webcamRef.current.getScreenshot()!;

    const ctx = canvas.getContext("2d")!;
    ctx.filter =
      "saturate(4) contrast(1.2) hue-rotate(60deg) invert() brightness(2) grayscale() brightness(2.5) contrast(1.5)";

    image.src = imageSrc;
    image.onload = async () => {
      ctx.drawImage(image, 930, 55, 280, 2, 0, 0, 300, 750);
      ctx.drawImage(image, 940, 55, 280, 35, 0, 0, 350, 50); // Poke
      ctx.drawImage(image, 1155, 15, 60, 20, 0, 50, 120, 40); // Lv.
      ctx.drawImage(image, 1055, 142, 140, 35, 0, 100, 200, 50); // HP
      ctx.drawImage(image, 1140, 220, 50, 35, 0, 150, 80, 50); // Attack
      ctx.drawImage(image, 1140, 295, 50, 35, 0, 200, 80, 50); // Defense
      ctx.drawImage(image, 930, 220, 50, 35, 0, 250, 80, 50); // SP Attack
      ctx.drawImage(image, 930, 295, 50, 35, 0, 300, 80, 50); // SP Defense
      ctx.drawImage(image, 1055, 345, 60, 35, 0, 350, 80, 50); // Speed

      ctx.drawImage(image, 970, 385, 280, 35, 0, 400, 340, 40); // Ability
      ctx.drawImage(image, 848, 55, 280, 35, 0, 450, 340, 50); // Held Item header
      ctx.drawImage(image, 970, 425, 280, 35, 50, 450, 340, 50); // Held Item

      ctx.drawImage(image, 880, 465, 280, 35, 0, 500, 340, 50); // Move1
      ctx.drawImage(image, 880, 505, 280, 35, 0, 550, 340, 50); // Move2
      ctx.drawImage(image, 880, 545, 280, 35, 0, 600, 340, 50); // Move2
      ctx.drawImage(image, 880, 585, 280, 35, 0, 650, 340, 50); // Move2

      ctx.drawImage(image, 1026, 100, 80, 35, 10, 700, 120, 50); // Tera1
      ctx.drawImage(image, 1163, 100, 80, 35, 140, 700, 120, 50); // Tera2

      const { data } = await Tesseract.recognize(canvas);
      const trimmed = data.text
        .trim()
        .split("\n")
        .filter((s) => s.length);
      console.log(trimmed);

      const teraIndex = trimmed.length - 1;

      const rawStats: Record<string, string> = {
        name: trimmed[0],
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
        tera: trimmed[teraIndex]
          .split(" ")
          .reverse()[0]
          .replace(/[^A-Z]/g, ""),
      };

      for (let i = 10; i < teraIndex; i++) {
        rawStats[`move${i - 9}`] = trimmed[i];
      }

      setStats(rawStats);
    };
  };

  const onSaveToPDF = async () => {
    const url = "./team-list.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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
          font: helveticaFont,
        });
      });
    });
    rightOrder.forEach((idx, i) => {
      pages[0].drawText(stats[idx], {
        x: 250,
        y: 628 - i * 23.4,
        size: 12,
        font: helveticaFont,
      });
    });

    const pdfBytes = await pdfDoc.save();
    const file = new Blob([pdfBytes], {
      type: "application/pdf",
    });
    const fileURL = URL.createObjectURL(file);
    const printer = document.getElementById("printer") as HTMLIFrameElement;
    printer.src = fileURL;
    printer.onload = () => {
      printer.contentWindow!.print();
      URL.revokeObjectURL(fileURL);
    };
  };

  return (
    <>
      <main className="text-white text-2xl">
        <div className="flex">
          <div className="aspect-video max-w-[1280px]">
            <Webcam
              videoConstraints={{
                deviceId: activeDeviceId,
              }}
              audio={false}
              screenshotFormat="image/png"
              ref={webcamRef}
              width={1280}
              height={720}
            />
          </div>

          <div className="p-4">
            <div className="flex gap-2">
              <Button variant={"secondary"} onClick={onCapture}>
                Capture stats
              </Button>
              <Button variant={"secondary"} onClick={onSaveToPDF}>
                Save to sheet
              </Button>
            </div>
            {Object.entries(stats).map(([key, val]) => {
              return (
                <p key={key}>
                  {key}: {val}
                </p>
              );
            })}
          </div>
          <img src="" ref={imageRef} className="hidden"></img>
          <canvas
            className="hidden"
            ref={canvasRef}
            width={300}
            height={750}
          ></canvas>
        </div>
        <iframe className="hidden" id="printer"></iframe>
      </main>
    </>
  );
}

export default App;
