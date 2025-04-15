import { Fragment, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import useScanPokeBox from "./hooks/useScanPokeBox";
import useRenderPokeTeamList from "./hooks/useRenderPokeTeamList";
import PokeCam from "./components/PokeCam";
import Webcam from "react-webcam";
import { PokeStats } from "./lib/PokeStatsSchema";
import { useForm } from "react-hook-form";
import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarProvider,
} from "./components/ui/sidebar";

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
      <main className="container relative text-white mx-auto max-w-[1280px] flex flex-col gap-6 ">
        <h1 className="text-3xl mt-6 text-shadow-lg/30 font-bold">
          VGC team list scanner
        </h1>
        <div className="aspect-video bg-blue-600 rounded overflow-clip shadow-lg/40">
          <PokeCam ref={camref} />
        </div>
        <div className="relative flex">
          <SidebarProvider className="relative left-0 top-0 h-fit min-h-fit">
            <Sidebar
              variant="floating"
              className="relative left-0 top-0 h-fit rounded font-semibold p-2 shadow-lg/40"
              collapsible="none"
            >
              <SidebarContent>
                <SidebarMenuButton>Pokemon</SidebarMenuButton>
                <SidebarMenuButton>Pokemon</SidebarMenuButton>
                <SidebarMenuButton>Pokemon</SidebarMenuButton>
                <SidebarMenuButton>Pokemon</SidebarMenuButton>
                <SidebarMenuButton>Pokemon</SidebarMenuButton>
                <SidebarMenuButton>Pokemon</SidebarMenuButton>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1">
              {Object.entries(stats!).map(([key, val]) => {
                return (
                  <Fragment key={key}>
                    <span>{key}: </span>
                    <span>{val}</span>
                  </Fragment>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant={"secondary"}
                onClick={() => scanStats(camref.current!.video)}
              >
                Capture stats
              </Button>
              <Button variant={"secondary"} onClick={() => renderPdf(stats!)}>
                Print team list
              </Button>
              <hr></hr>
              <Button variant={"secondary"} onClick={() => renderPdf(stats!)}>
                New team list
              </Button>
            </div>
          </SidebarProvider>
        </div>
      </main>
    </>
  );
}

export default App;
