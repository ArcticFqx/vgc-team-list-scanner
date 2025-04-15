import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import useScanPokeBox from "./hooks/useScanPokeBox";
import useRenderPokeTeamList from "./hooks/useRenderPokeTeamList";
import PokeCam from "./components/PokeCam";
import Webcam from "react-webcam";
import { useForm } from "react-hook-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarProvider,
} from "./components/ui/sidebar";
import { usePokeStore } from "./lib/PokeStatsStore";
import { PokeStats, PokeStatsSchema } from "./lib/PokeStatsSchema";

function App() {
  const camref = useRef<Webcam>(null);

  const [currentPoke, setCurrentPoke] = useState<number>(0);

  const statsList = usePokeStore((store) => store.pkmnStatsList);
  const setPokeStatsAt = usePokeStore((store) => store.setPokeStatsAt);

  const { register, setValue, control, getValues } = useForm<PokeStats>();

  const renderPdf = useRenderPokeTeamList();
  const scanStats = useScanPokeBox((stats) => {
    Object.entries(stats).forEach(([key, value]) => {
      setValue(key as keyof PokeStats, value);
    });
    setPokeStatsAt(currentPoke, stats);
  });

  useEffect(() => {
    const stats = PokeStatsSchema.parse(statsList[currentPoke]);
    Object.entries(stats).forEach(([key, value]) => {
      setValue(key as keyof PokeStats, value);
    });
  }, [currentPoke]);

  const onSelectPokemon = (entry: number) => () => {
    setCurrentPoke(entry);
  };

  const onPokeEdit = () => {
    const stats = PokeStatsSchema.parse(getValues());
    setPokeStatsAt(currentPoke, stats);
  };

  return (
    <>
      <main className="container relative text-white mx-auto max-w-[1280px] flex flex-col gap-4 ">
        <h1 className="text-3xl mt-6 text-shadow-lg/30 font-bold">
          VGC team list scanner
        </h1>
        <div className="aspect-video bg-blue-600 rounded overflow-clip shadow-lg/40">
          <PokeCam ref={camref} />
        </div>
        <SidebarProvider className="relative left-0 top-0 h-fit min-h-fit">
          <div className="flex flex-col gap-2 bg-sidebar/95 rounded mr-4 p-4 shadow-lg/40 ">
            <Button
              variant={"secondary"}
              onClick={() => scanStats(camref.current!.video)}
            >
              Capture stats
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => renderPdf(statsList[currentPoke])}
            >
              Print team list
            </Button>
            {/*
            <Button
              variant={"secondary"}
              onClick={() => renderPdf(stats[currentPoke])}
            >
              New team list
            </Button>
  */}
          </div>
          <Sidebar
            variant="floating"
            className="relative left-0 top-0 rounded font-semibold p-2 shadow-lg/40 h-[initial] bg-sidebar/95"
            collapsible="none"
          >
            <SidebarGroupLabel>Your team</SidebarGroupLabel>
            <SidebarContent>
              {[...Array(6)].map((_, i) => {
                return (
                  <SidebarMenuButton
                    key={i}
                    onClick={onSelectPokemon(i)}
                    className={currentPoke == i ? "bg-teal-500/40" : ""}
                  >
                    {statsList[i].name || `Pokemon ${i + 1}`}
                  </SidebarMenuButton>
                );
              })}
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 ml-4 p-4 bg-sidebar/95 shadow-lg/40 rounded text-black flex gap-4">
            <form
              className="flex flex-col text-base gap-1 font-semibold"
              onChange={onPokeEdit}
            >
              <div></div>
              <div className="flex gap-4">
                <div className="grid grid-cols-[auto_200px] gap-x-2 gap-y-1">
                  <label>Pokémon: </label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("name")}
                  ></input>
                  <label>Tera type:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("tera")}
                  ></input>
                  <label>Ability:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("ability")}
                  ></input>
                  <label>Held Item:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("item")}
                  ></input>
                  <label>Move 1:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("move1")}
                  ></input>
                  <label>Move 2:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("move2")}
                  ></input>
                  <label>Move 3:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("move3")}
                  ></input>
                  <label>Move 4:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("move4")}
                  ></input>
                </div>
                <div className="grid grid-cols-[auto_50px] gap-x-4 gap-y-1 h-fit">
                  <label>Level:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("level")}
                  ></input>
                  <label>HP:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("hp")}
                  ></input>
                  <label>Attack:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("attack")}
                  ></input>
                  <label>Defense:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("defense")}
                  ></input>
                  <label>Sp. Atk:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("spatk")}
                  ></input>
                  <label>Sp. Def:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("spdef")}
                  ></input>
                  <label>Speed:</label>
                  <input
                    className="border border-black rounded p-1 h-8"
                    {...register("speed")}
                  ></input>
                </div>
              </div>
            </form>
          </div>
        </SidebarProvider>
      </main>
    </>
  );
}

export default App;
