import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { letras, splitIntoGroups, temas } from "./utils/const.utils";
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
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
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
import { Badge } from "./components/ui/badge";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import { LetterText, RotateCcw } from "lucide-react";
import { Switch } from "./components/ui/switch";
import {
  shareOnWhatsApp,
  shareOnTwitter,
  openGithub,
} from "./utils/redirect.utils";
import { useExcludeLetters } from "./store/useLetters";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTheme } from "@/components/theme-provider";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";

interface PlayerProps {
  id?: number;
  name: string;
  points: number;
  currentPoints: number;
}

function App() {
  const [randomLetter, setRandomLetter] = useState<string>("");
  const [historyLetter, setHistoryLetter] = useState<string[]>([]);
  const [timerValue, setTimerValue] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [start, setStart] = useState(false);
  const [alert, setAlert] = useState(false);
  const [rodadas, setRodadas] = useState(3);
  const [currentRodada, setCurrentRodada] = useState(0);
  const [volumeState, setVolumeState] = useState(false);
  const [players, setPlayers] = useState<PlayerProps[]>([
    { id: 0, name: "", points: 0, currentPoints: 0 },
    { id: 1, name: "", points: 0, currentPoints: 0 },
  ]);
  const [modalSugest, setModalSugest] = useState(false);
  const [themeSugest, setThemeSugest] = useState<string[]>([]);
  const [themeExclude] = useState<string[]>([]);
  const [leaderBoardModal, setLeaderBoardModal] = useState<boolean>(false);
  const [leaderBoard, setLeaderBoard] = useState<PlayerProps[][]>(() => {
    const storedLeaderBoard = localStorage.getItem("leaderboard");
    return storedLeaderBoard ? JSON.parse(storedLeaderBoard) : [];
  });
  const [paginationLeaderBoard, setPaginationLeaderBoard] = useState<
    PlayerProps[][][]
  >([]);
  const [currentPaginatinationPage, setCurrentPaginationPage] = useState(0);
  const [timer, setTimer] = useState(false);
  const [valueTimer, setValueTimer] = useState(3);
  const [showInitialTimer, setShowInitialTimer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { theme, setTheme } = useTheme();

  const audio = new Audio(sirene);

  const {
    excludesLetters,
    addingExcludeLetter,
    removeExcludeLetter,
    resetExcludeLetter,
  } = useExcludeLetters();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
    if (timeLeft === 0) {
      setAlert(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(`Letra: ` + randomLetter);
    const voices = synth.getVoices();
    if (randomLetter !== undefined || randomLetter !== "") {
      u.volume = 1;
      u.voice =
        voices.find(
          (v) => v.name === "Microsoft Daniel - Portuguese (Brazil)"
        ) || null;
      if (volumeState) {
        synth.speak(u);
      }
    }

    return () => {
      synth.cancel();
    };
  }, [randomLetter]);

  const getRandomLetter = () => {
    let index = Math.floor(Math.random() * 25);

    while (
      historyLetter.includes(letras[index]) ||
      excludesLetters.includes(letras[index])
    ) {
      index = Math.floor(Math.random() * 25);
    }

    setRandomLetter(letras[index]);
    setHistoryLetter((prevState) => [...prevState, letras[index]]);
    setCurrentRodada((prevState) => prevState + 1);
    if (timeLeft === 0 || timeLeft === -1) {
      setTimeLeft(timerValue);
    }
  };

  useEffect(() => {
    if (timer && rodadas !== currentRodada) {
      const interval = setInterval(() => {
        setValueTimer((prevState) => {
          if (prevState === 1) {
            clearInterval(interval);
            setTimer(false);
            getRandomLetter();
            return 0;
          }
          return prevState - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
    if (historyLetter.length === rodadas + 1) {
      setTimer(false);
      setAlert(false);
    } else {
      setValueTimer(3);
    }
  }, [timer]);

  useEffect(() => {
    localStorage.setItem("leaderboard", JSON.stringify(leaderBoard));
  }, [historyLetter.length === rodadas + 1]);

  useEffect(() => {
    setTheme(!isDarkMode ? "light" : "dark");
  }, [isDarkMode]);

  useEffect(() => {
    setPaginationLeaderBoard(splitIntoGroups(leaderBoard, 3));
  }, [start]);

  const handleSelectChange = (value: string) => {
    setTimerValue(Number(value));
  };

  const reset = () => {
    setRandomLetter("");
    setHistoryLetter([]);
    resetExcludeLetter();
    setTimeLeft(-1);
    setStart(false);
    setCurrentRodada(0);
    setPlayers((prevState) =>
      prevState.map((item) => {
        return { name: item.name, points: 0, currentPoints: 0 };
      })
    );
  };

  const handleNumPlayersChange = (valueS: string) => {
    const value = Number(valueS);
    setPlayers(
      Array.from({ length: value }, (_, index) => ({
        name: `Player ${index + 1}`,
        points: 0,
        currentPoints: 0,
      }))
    );
  };

  const handleScoreChange = (index: number, value: number) => {
    const newPlayers = [...players];
    newPlayers[index].currentPoints = value;
    setPlayers(newPlayers);
  };

  const handleScorePermaChange = (index: number) => {
    const newPlayers = [...players];
    newPlayers[index].points += newPlayers[index].currentPoints;
    newPlayers[index].currentPoints = 0;
    setPlayers(newPlayers);
  };

  const handleNameChange = (index: number, newName: string) => {
    const updatedPlayers = players.map((player, i) =>
      i === index ? { ...player, name: newName } : player
    );
    setPlayers(updatedPlayers);
  };

  const handleClick = (index: number) => {
    let count = 0;
    if (showInitialTimer && historyLetter.length !== rodadas) {
      setTimer((prevState) => !prevState);
    } else {
      getRandomLetter();
    }

    console.log(leaderBoard);
    if (rodadas === currentRodada + 1) {
      setLeaderBoard((prevState) => [...prevState, players]);
      console.log("atualizado", leaderBoard);
    }

    while (index != count) {
      handleScorePermaChange(count);
      count++;
    }
  };

  const renderInputs = () => {
    return players.map((player, index) => (
      <div key={index}>
        <div className="player-input flex flex-col gap-2">
          {index === 0 && (
            <div className="flex w-full gap-2 ">
              <Button onClick={() => handleClick(players.length)}>
                {rodadas === currentRodada
                  ? "Finalizar partida"
                  : "Gerar próximo"}
              </Button>
              {currentRodada > 0 && (
                <>
                  <Button onClick={reset}>Reiniciar jogo</Button>
                  <Button
                    onClick={() => setTimeLeft(0)}
                    variant={"destructive"}
                    disabled={timeLeft === 0}
                  >
                    {/* Stop! */}
                    <PanToolOutlinedIcon />
                  </Button>
                </>
              )}
            </div>
          )}
          <input
            type="text"
            value={player.name}
            placeholder="Digite seu nome"
            onChange={(e) => handleNameChange(index, e.target.value)}
            className="outline-none input-no-outline bg-transparent"
          />
          <div className="flex gap-1">
            <Input
              type="number"
              onChange={(e) => handleScoreChange(index, Number(e.target.value))}
              placeholder="Digite seus pontos"
              className="input-class"
            />
          </div>
          <Separator />
        </div>
      </div>
    ));
  };

  const getRandomThemes = (quantity: number) => {
    console.log(quantity);
    let increment = 0;
    let index = Math.floor(Math.random() * 99);
    let newThemes: string[] = [];

    while (increment !== quantity) {
      console.log(index);
      console.log(temas[index]);

      if (!themeExclude.includes(temas[index])) {
        newThemes.push(temas[index]);
        increment++;
      }
      index = Math.floor(Math.random() * 99);
    }

    setThemeSugest((prevState) => [...prevState, ...newThemes]);
  };

  {
    alert && volumeState && audio.play();
  }

  return (
    <div>
      {!start ? (
        <div
          className={` min-h-[90vh] box-border m-5 flex flex-col justify-center `}
        >
          <div
            className={`w-full h-full flex flex-col gap-2 justify-center items-center  `}
          >
            <h1
              className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${
                theme === "dark" && "text-white"
              }`}
            >
              Adedonha
            </h1>
            <Separator />
            <p className={`font-extrabold tracking-tight text-xl`}>
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
        </div>
      ) : historyLetter.length === rodadas + 1 ? (
        <AlertDialog open={true} onOpenChange={setAlert}>
          <AlertDialogContent className="w-3/4 rounded-lg md:rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle
                className={`${theme === "dark" && "text-white"}`}
              >
                Fim de jogo
              </AlertDialogTitle>
              <AlertDialogDescription
                className={`flex flex-col gap-3 ${
                  theme === "dark" && "text-white"
                }`}
              >
                {rodadas} rodadas atigidas
                <Separator />
                <div className="flex flex-col items-start">
                  {players.map((item, index) => (
                    <p key={index}>
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
        <div className="min-h-[90vh] box-border m-5 flex flex-col justify-between ">
          <div className="flex ">
            <Sheet>
              <SheetTrigger className="flex justify-between w-full items-center">
                <LetterText
                  style={{ color: theme === "dark" ? "white" : "black" }}
                />
                {/* <SheetTitle className="flex items-center gap-2">
                Rodada:{currentRodada}/{rodadas}
              </SheetTitle> */}
              </SheetTrigger>
              <SheetContent
                side={"left"}
                className="flex flex-col gap-11 h-full overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Exclua as letras indesejadas</SheetTitle>
                  <SheetDescription>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      className="flex flex-wrap w-full justify-between gap-3"
                    >
                      <div className="flex justify-between flex-wrap gap-2">
                        {letras.map((letter) => (
                          <ToggleGroupItem
                            key={letter}
                            value={letter}
                            className="w-[50px] h-[50px] text-lg"
                            aria-label="Toggle bold"
                            onClick={() =>
                              !excludesLetters.includes(letter)
                                ? addingExcludeLetter(letter)
                                : removeExcludeLetter(letter)
                            }
                          >
                            {letter}
                          </ToggleGroupItem>
                        ))}
                      </div>

                      <Separator />

                      <div className="flex flex-col gap-3 w-full">
                        <p className="flex items-center justify-center gap-4">
                          Letras atualmente excluidas: <br />
                          <Button
                            variant={"outline"}
                            onClick={() => resetExcludeLetter()}
                          >
                            <RotateCcw />
                          </Button>
                        </p>
                        <p className="text-red-600 font-bold text-lg">
                          {excludesLetters.map((letters, index) =>
                            index !== excludesLetters.length - 1
                              ? `${letters} - `
                              : letters
                          )}
                        </p>
                        <Button
                          className="w-full flex gap-3"
                          onClick={() =>
                            setModalSugest((prevState) => !prevState)
                          }
                        >
                          <Badge variant="secondary">Beta</Badge>
                          Sugestões de temas
                        </Button>
                      </div>

                      <AlertDialog
                        open={modalSugest}
                        onOpenChange={setModalSugest}
                      >
                        <AlertDialogContent className="w-3/4 rounded-lg md:rounded-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="w-full">
                              Sugestões de temas
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex flex-col gap-3">
                              <div className="flex gap-1 w-fit flex-wrap justify-center">
                                {themeSugest.map((tema) => (
                                  <Badge variant="default">{tema}</Badge>
                                ))}
                              </div>

                              <Separator />
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-col gap-2">
                            <Button
                              onClick={() => getRandomThemes(7)}
                              disabled={themeSugest.length >= 30}
                            >
                              Gerar
                            </Button>
                            <Button
                              onClick={() => setThemeSugest([])}
                              variant={"secondary"}
                            >
                              Limpar sugestões
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() =>
                                setModalSugest((prevState) => !prevState)
                              }
                            >
                              Fechar
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </ToggleGroup>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <h2
              className={`font-mono text-xl font-bold ${
                theme === "dark" && "text-white"
              }`}
            >
              Rodada:{currentRodada}/{rodadas}
            </h2>
            <Sheet>
              <SheetTrigger className="flex justify-end w-full items-center">
                <MenuIcon
                  sx={{ color: theme === "dark" ? "white" : "black" }}
                />
              </SheetTrigger>
              <SheetContent
                side={"right"}
                className="flex flex-col gap-11 h-full overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Configurações da partida</SheetTitle>
                  <SheetDescription>
                    <div className="flex flex-col gap-4">
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
                          <SelectItem value="90" className="flex gap-2">
                            90 segundos <Badge variant="secondary">1:30</Badge>
                          </SelectItem>
                          <SelectItem value="120">
                            120 segundos <Badge variant="secondary">2:00</Badge>
                          </SelectItem>
                          <SelectItem value="150">
                            150 segundos <Badge variant="secondary">2:30</Badge>
                          </SelectItem>
                          <SelectItem value="180">
                            180 segundos <Badge variant="secondary">3:00</Badge>
                          </SelectItem>
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
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                        </SelectContent>
                      </Select>

                      <Separator />

                      <Button
                        className="flex gap-4"
                        onClick={() =>
                          setPlayers([
                            { name: "", points: 0, currentPoints: 0 },
                          ])
                        }
                      >
                        <PersonOffOutlinedIcon /> Limpar nome dos jogadores
                      </Button>

                      <Button
                        className="flex gap-4"
                        onClick={() => setIsDarkMode((prevState) => !prevState)}
                      >
                        {theme === "light" ? (
                          <>
                            <BedtimeOutlinedIcon /> Modo escuro
                          </>
                        ) : (
                          <>
                            <WbSunnyOutlinedIcon /> Modo claro
                          </>
                        )}
                      </Button>
                      <div className="flex justify-center flex-col items-center gap-2">
                        <div className="flex gap-2 items-center">
                          <p>Exibir contagem regressiva</p>
                          <Switch
                            checked={showInitialTimer}
                            onCheckedChange={() =>
                              setShowInitialTimer((prevState) => !prevState)
                            }
                          />
                        </div>
                      </div>

                      <AlertDialog
                        open={modalSugest}
                        onOpenChange={setModalSugest}
                      >
                        <AlertDialogContent className="w-3/4 rounded-lg md:rounded-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="w-full">
                              Sugestões de temas
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex flex-col gap-3">
                              <div>
                                {themeSugest.map((tema) => (
                                  <Badge variant="default">{tema}</Badge>
                                ))}
                              </div>

                              <Separator />
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-col gap-2">
                            <Button onClick={() => getRandomThemes(7)}>
                              Gerar
                            </Button>
                            <Button
                              onClick={() => setThemeSugest([])}
                              variant={"secondary"}
                            >
                              Limpar sugestões
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() =>
                                setModalSugest((prevState) => !prevState)
                              }
                            >
                              Fechar
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <div className="absolute bottom-4 flex w-[85%] flex-col gap-1 justify-center items-center">
                    <GitHubIcon
                      onClick={openGithub}
                      sx={{ color: theme === "dark" ? "white" : "black" }}
                    />

                    <CardDescription
                      className={`${theme === "dark" && "text-white"}`}
                    >
                      Desenvolvido com ❤️ por Shouldz
                    </CardDescription>
                    <Separator />
                    <p
                      className={`font-extrabold tracking-tight text-sm ${
                        theme === "dark" && "text-white"
                      }`}
                    >
                      Que tal compartilhar?
                    </p>

                    <div className="flex gap-6">
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
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          <section className="w-full h-full flex flex-col justify-center items-center gap-4">
            <h1
              className={` text-4xl font-extrabold tracking-tight lg:text-5xl ${
                theme === "dark" && "text-white"
              }`}
            >
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
                  className="w-full h-[33vh] bg-gray-500 text-white text-9xl"
                  aria-label="Toggle bold"
                >
                  {randomLetter}
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            <AlertDialog open={alert} onOpenChange={setAlert}>
              <AlertDialogContent className="w-3/4 rounded-lg md:rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className={`${theme === "dark" && "text-white"}`}
                  >
                    STOPPPPP
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    PAREM AS CANETAS!!! ACABOU O TEMPO
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Fechar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={leaderBoardModal}
              onOpenChange={setLeaderBoardModal}
            >
              <AlertDialogContent className="w-[80%] rounded-lg md:rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className={`${theme === "dark" && "text-white"}`}
                  >
                    Leaderboard
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Placares dos jogos anteriores
                    {paginationLeaderBoard[currentPaginatinationPage] !==
                    undefined ? (
                      paginationLeaderBoard[currentPaginatinationPage].map(
                        (round, roundIndex) => (
                          <div key={roundIndex} className="mb-4">
                            <p className="text-lg font-bold">
                              Jogo {roundIndex + 1}
                            </p>

                            {round.map((player: PlayerProps) => (
                              <p
                                key={
                                  player.id || `${player.name}-${roundIndex}`
                                }
                              >
                                {player.name} - {player.points}
                              </p>
                            ))}
                          </div>
                        )
                      )
                    ) : (
                      <p>Sem dados anteriores</p>
                    )}
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            className={
                              currentPaginatinationPage <
                                Math.ceil(leaderBoard.length / 3) - 1 ||
                              currentPaginatinationPage === 0
                                ? "pointer-events-none opacity-50"
                                : undefined
                            }
                            onClick={() =>
                              setCurrentPaginationPage(
                                (prevState) => prevState - 1
                              )
                            }
                          />
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationLink href="#" isActive>
                            {currentPaginatinationPage}
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            className={
                              currentPaginatinationPage >
                              Math.ceil(leaderBoard.length / 3) - 2
                                ? "pointer-events-none opacity-50"
                                : undefined
                            }
                            onClick={() =>
                              setCurrentPaginationPage(
                                (prevState) => prevState + 1
                              )
                            }
                          >
                            {currentPaginatinationPage + 1}
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            className={
                              currentPaginatinationPage >
                              Math.ceil(leaderBoard.length / 3) - 2
                                ? "pointer-events-none opacity-50"
                                : undefined
                            }
                            onClick={() =>
                              setCurrentPaginationPage(
                                (prevState) => prevState + 1
                              )
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setLeaderBoardModal(false)}>
                    Fechar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={timer} onOpenChange={setTimer}>
              <AlertDialogContent className="w-3/4 h-1/3 rounded-lg shadow-none md:rounded-xl bg-transparent border-none">
                <AlertDialogHeader className="flex flex-col gap-6 justify-center">
                  <AlertDialogTitle className="text-3xl text-white">
                    Próxima letra em:
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-5xl font-extrabold animate-ping shadow-slate-700 text-white">
                    {valueTimer}
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>

            <Card className="w-full overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center w-full justify-between">
                  Letras que já sairam:
                  <LeaderboardIcon
                    onClick={() =>
                      setLeaderBoardModal((prevState) => !prevState)
                    }
                  />
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
              <CardContent className="flex gap-2 flex-col">
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
                {currentRodada === 0 && (
                  <Button
                    onClick={() =>
                      showInitialTimer
                        ? setTimer((prevState) => !prevState)
                        : getRandomLetter()
                    }
                    disabled={historyLetter.length === 25 || timeLeft > 0}
                  >
                    Gerar letra
                  </Button>
                )}
                {currentRodada > 0 && timeLeft !== 0 && (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => setTimeLeft(0)}
                      variant={"destructive"}
                      className="w-[50vw] h-[20vh]"
                      disabled={timeLeft === 0}
                    >
                      {/* Stop! */}
                      <PanToolOutlinedIcon
                        sx={{
                          width: "100px !important",
                          height: "100px !important",
                          fontSize: "90px",
                        }}
                      />
                    </Button>
                    {/* <Button onClick={reset}>Reiniciar jogo</Button> */}
                  </div>
                )}
              </CardFooter>
            </Card>
          </section>

          <div></div>
        </div>
      )}
    </div>
  );
}

export default App;
