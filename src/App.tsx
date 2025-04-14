import { useRef, useState } from "react";
import { Button } from "./components/ui/button";
import useScanPokeBox, { PokeStats } from "./hooks/useScanPokeBox";
import useRenderPokeTeamList from "./hooks/useRenderPokeTeamList";
import PokeCam from "./components/PokeCam";
import Webcam from "react-webcam";

function App() {
  const [stats, setStats] = useState<PokeStats>({} as PokeStats);

  const renderPdf = useRenderPokeTeamList();
  const scanStats = useScanPokeBox((stats) => {
    console.log(stats);
    setStats(stats);
  });

  const camref = useRef<Webcam>(null);

  return (
    <>
      <main className="text-white text-2xl">
        <div className="flex">
          <div className="aspect-video max-w-[1280px]">
            <PokeCam ref={camref} />
          </div>

          <div className="p-4">
            <div className="flex gap-2">
              <Button
                variant={"secondary"}
                onClick={() => scanStats(camref.current!.video)}
              >
                Capture stats
              </Button>
              <Button variant={"secondary"} onClick={() => renderPdf(stats!)}>
                Save to sheet
              </Button>
            </div>
            <div className="grid grid-cols-2">
              {Object.entries(stats!).map(([key, val]) => {
                return (
                  <>
                    <span>{key}: </span>
                    <input defaultValue={val} />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
