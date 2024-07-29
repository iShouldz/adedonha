import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { letras } from "./utils/const.utils";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import MenuIcon from "@mui/icons-material/Menu";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import sirene from "./assets/sirene.mp3";
import XIcon from "@mui/icons-material/X";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "./components/ui/progress";
import { Separator } from "./components/ui/separator";
import stop from "./assets/stop.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./components/ui/input";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

interface PlayerProps {
  name: string;
  points: number;
}

function App() {
  const [randomLetter, setRandomLetter] = useState<string>("");
  const [historyLetter, setHistoryLetter] = useState<string[]>([]);
  const [excludeLetters, setExcludeLetters] = useState<string[]>([]);
  const [timerValue, setTimerValue] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [start, setStart] = useState(false);
  const [alert, setAlert] = useState(false);
  const [rodadas, setRodadas] = useState(3);
  const [currentRodada, setCurrentRodada] = useState(0);
  const [volumeState, setVolumeState] = useState(false);
  const audio = new Audio(sirene);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
    if (timeLeft === 0) {
      setAlert(true);
    }
  }, [timeLeft]);

  const shareOnWhatsApp = () => {
    const text =
      "Venha jogar adedonha da maneira classica so que bem melhor! :) https://adedonha.vercel.app";
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");
  };

  const shareOnTwitter = () => {
    const text =
      "Venha jogar adedonha da maneira classica so que bem melhor! :) https://adedonha.vercel.app";
    const url = "https://adedonha.vercel.app";
    const hashtags = "adedonha,sharing";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}&hashtags=${hashtags}}`;

    window.open(twitterUrl, "_blank");
  };

  const openGithub = () => {
    window.open("https://github.com/iShouldz", "_blank");
  };

  const handleSelectChange = (value: string) => {
    setTimerValue(Number(value));
  };

  const getRandomLetter = () => {
    let index = Math.floor(Math.random() * 25);

    while (
      historyLetter.includes(letras[index]) ||
      excludeLetters.includes(letras[index])
    ) {
      console.log(`Repetiu, rodando novamente: ${letras[index]}`);
      index = Math.floor(Math.random() * 25);
      console.log(`Novo valor: ${letras[index]}`);
    }

    setRandomLetter(letras[index]);
    setHistoryLetter((prevState) => [...prevState, letras[index]]);
    setCurrentRodada((prevState) => prevState + 1);
    if (timeLeft === 0 || timeLeft === -1) {
      setTimeLeft(timerValue);
    }
  };

  const reset = () => {
    setRandomLetter("");
    setHistoryLetter([]);
    setExcludeLetters([]);
    setTimeLeft(-1);
    setStart(false);
    setCurrentRodada(0);
  };

  const [players, setPlayers] = useState<PlayerProps[]>([
    { name: "", points: 0 },
  ]);

  const handleNumPlayersChange = (valueS: string) => {
    const value = Number(valueS);
    setPlayers(
      Array.from({ length: value }, (_, index) => ({
        name: `Player ${index + 1}`,
        points: 0,
      }))
    );
  };
  {
    alert && volumeState && audio.play();
  }
  const handleScoreChange = (index: number, value: number) => {
    const newPlayers = [...players];
    newPlayers[index].points = value;
    setPlayers(newPlayers);
  };

  const handleNameChange = (index: number, newName: string) => {
    const updatedPlayers = players.map((player, i) =>
      i === index ? { ...player, name: newName } : player
    );
    setPlayers(updatedPlayers);
  };

  const renderInputs = () => {
    return players.map((player, index) => (
      <div key={index} className="player-input">
        {/* <label>Player {index + 1}</label> */}
        <input
          type="text"
          value={player.name}
          onChange={(e) => handleNameChange(index, e.target.value)}
          className="outline-none input-no-outline"
        />
        <div className="flex gap-1">
          <Input
            type="number"
            value={player.points}
            onChange={(e) => handleScoreChange(index, Number(e.target.value))}
            className="input-class"
          />
          <Button onClick={() => incrementScore(index, 5)}>+5</Button>
          <Button onClick={() => incrementScore(index, 10)}>+10</Button>
        </div>
      </div>
    ));
  };
  console.log(players);
  const incrementScore = (index: number, increment: number) => {
    const newPlayers = [...players];
    newPlayers[index].points += increment;
    setPlayers(newPlayers);
  };

  return (
    <div className="max-sm:bg-[#ced6dc] h-[100vh] max-sm:p-5">
      {!start ? (
        <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Adedonha
          </h1>
          <Separator />
          <p className="font-extrabold tracking-tight text-xl">
            O classico, só que moderno.
          </p>
          <img src={stop} />

          <Button
            onClick={() => setStart((prevState) => !prevState)}
            className="w-full h-12 text-xl"
          >
            Começar
          </Button>
        </div>
      ) : historyLetter.length === rodadas + 1 ? (
        <AlertDialog open={true} onOpenChange={setAlert}>
          <AlertDialogContent className="w-3/4 rounded-lg md:rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Fim de jogo</AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col gap-3">
                {rodadas} rodadas atigidas
                <Separator />
                <div className="flex flex-col items-start">
                  {players.map((item) => (
                    <p>
                      {item.name}: {item.points} pontos
                    </p>
                  ))}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={reset} variant="destructive">
                Reiniciar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <>
          <Sheet>
            <SheetTrigger className="flex justify-between w-full items-center">
              <MenuIcon />
              <SheetTitle className="flex items-center gap-2">
                Rodada:{currentRodada}/{rodadas}
              </SheetTitle>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle>Exclua as letras indesejadas</SheetTitle>
                <SheetDescription>
                  <ToggleGroup
                    type="multiple"
                    variant="outline"
                    className="flex flex-wrap w-full justify-between gap-2"
                  >
                    {letras.map((letter) => (
                      <ToggleGroupItem
                        key={letter}
                        value={letter}
                        aria-label="Toggle bold"
                        onClick={() =>
                          setExcludeLetters((prevState) => [
                            ...prevState,
                            letter,
                          ])
                        }
                      >
                        {letter}
                      </ToggleGroupItem>
                    ))}

                    <Separator />

                    <p>Selecione o número de rodadas</p>
                    <Select
                      disabled={timeLeft !== -1}
                      onValueChange={(value: string) =>
                        setRodadas(Number(value))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Rodadas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 rodadas</SelectItem>
                        <SelectItem value="3">3 rodadas</SelectItem>
                        <SelectItem value="4">4 rodadas</SelectItem>
                        <SelectItem value="5">5 rodadas</SelectItem>
                        <SelectItem value="6">6 rodadas</SelectItem>
                        <SelectItem value="7">7 rodadas</SelectItem>
                        <SelectItem value="8">8 rodadas</SelectItem>
                        <SelectItem value="9">9 rodadas</SelectItem>
                      </SelectContent>
                    </Select>

                    <Separator />
                    <p>Selecione o timer da rodada</p>

                    <Select
                      disabled={timeLeft !== -1}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Timer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 segundos</SelectItem>
                        <SelectItem value="60">60 segundos</SelectItem>
                        <SelectItem value="90">90 segundos</SelectItem>
                      </SelectContent>
                    </Select>

                    <Separator />
                    <p>Selecione o número de jogadores</p>

                    <Select
                      disabled={timeLeft !== -1}
                      onValueChange={handleNumPlayersChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jogadores" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                      </SelectContent>
                    </Select>
                  </ToggleGroup>
                </SheetDescription>
              </SheetHeader>
              <SheetFooter className="bottom-0 absolute pb-8 flex flex-col justify-center items-center w-[85%]">
                <CardDescription>
                  Desenvolvido com ❤️ por Shouldz
                </CardDescription>
                <GitHubIcon onClick={openGithub} />
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <section className="w-full h-full flex flex-col justify-center items-center gap-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Adedonha
            </h1>
            <Separator />
            {currentRodada > 0 && (
              <ToggleGroup
                type="single"
                variant="outline"
                className="flex flex-wrap w-full  gap-2"
              >
                <ToggleGroupItem
                  key={"letter"}
                  value="valor"
                  className="w-1/4 h-[9vh] bg-gray-500 text-white text-2xl"
                  aria-label="Toggle bold"
                >
                  {randomLetter}
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            <AlertDialog open={alert} onOpenChange={setAlert}>
              <AlertDialogContent className="w-3/4 rounded-lg md:rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>STOPPPPP</AlertDialogTitle>
                  <AlertDialogDescription>
                    PAREM AS CANETAS!!! ACABOU O TEMPO
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Fechar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center w-full justify-between">
                  Letras que já sairam:{" "}
                  {volumeState ? (
                    <VolumeUpIcon
                      onClick={() => setVolumeState((prevState) => !prevState)}
                    />
                  ) : (
                    <VolumeOffIcon
                      onClick={() => setVolumeState((prevState) => !prevState)}
                    />
                  )}
                </CardTitle>
                <CardDescription>
                  {timeLeft > 0 && (
                    <>
                      <h2>Contagem Regressiva: {timeLeft} segundos</h2>
                      <Progress
                        value={(timeLeft / timerValue) * 100}
                        max={100}
                      />
                    </>
                  )}

                  {timeLeft === 0 && <h2>Tempo Esgotado!</h2>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="flex flex-wrap w-full  gap-2"
                >
                  {historyLetter.map((letter) => (
                    <ToggleGroupItem
                      key={letter}
                      value="valor"
                      aria-label="Toggle bold"
                    >
                      {letter}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                {timeLeft === 0 && (
                  <div className="score-inputs">{renderInputs()}</div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 w-full justify-center">
                <Button
                  onClick={getRandomLetter}
                  disabled={historyLetter.length === 25 || timeLeft > 0}
                >
                  Gerar letra
                </Button>
                {currentRodada > 0 && (
                  <>
                    <Button onClick={reset}>Reiniciar jogo</Button>
                    <Button
                      onClick={() => setTimeLeft(0)}
                      variant={"destructive"}
                      disabled={timeLeft === 0}
                    >
                      Stop!
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
            <footer className="bottom-0 absolute p-8">
              <div className="flex justify-between gap-11">
                <Button
                  className="rounded-full w-16 h-16"
                  onClick={shareOnWhatsApp}
                >
                  <WhatsAppIcon />
                </Button>
                <Button
                  className="rounded-full w-16 h-16"
                  onClick={shareOnTwitter}
                >
                  <XIcon />
                </Button>
              </div>
            </footer>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
