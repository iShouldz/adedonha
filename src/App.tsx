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
import LeaderboardImage from "./components/LeaderboardImage/LeaderboardImage";
import { PlayerDetails, PlayerProps, TemplateState } from "./interfaces/player";
import StartArea from "./components/StartArea/StartArea";
import logo from "./assets/logo.png";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import dayjs from "dayjs";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import TemplateBoard from "./components/TemplateBoard/TemplateBoard";
import generatePDF, { Margin, Resolution } from "react-to-pdf";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import stopAlert from "./assets/stopAlert.png";

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
    {
      id: 0,
      name: "Player 1",
      points: 0,
      currentPoints: 0,
      data: dayjs(dayjs()).format("DD/MM/YYYY - HH:mm"),
    },
    {
      id: 1,
      name: "Player 2",
      points: 0,
      currentPoints: 0,
      data: dayjs(dayjs()).format("DD/MM/YYYY - HH:mm"),
    },
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
  const [details, setDetails] = useState<PlayerDetails>({
    state: false,
    match: [],
  });
  const [endGame, setEndGame] = useState(false);
  const [template, setTemplate] = useState<TemplateState>({
    state: false,
    temas: [],
    open: false,
  });
  const [currentSelectedTemas, setCurrentSelectedTemas] = useState("");
  const audio = new Audio(sirene);

  const {
    excludesLetters,
    addingExcludeLetter,
    removeExcludeLetter,
    resetExcludeLetter,
  } = useExcludeLetters();

  useEffect(() => {
    if (timeLeft > 0 && !endGame) {
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
      if (volumeState && !endGame && start) {
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
    setPaginationLeaderBoard(splitIntoGroups(leaderBoard, 2));
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
    setEndGame(false);
    setDetails({
      state: false,
      match: [],
    });
    setLeaderBoardModal(false);
    setPlayers((prevState) =>
      prevState.map((item) => {
        return {
          name: item.name,
          points: 0,
          currentPoints: 0,
          data: dayjs(dayjs()).format("DD/MM/YYYY - HH:mm"),
        };
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
        data: dayjs(dayjs()).format("DD/MM/YYYY - HH:mm"),
      }))
    );
  };

  const handleOpenTemplate = () => {
    setTemplate((prevState) => ({
      ...prevState,
      state: !prevState.state,
    }));
  };

  const options = {
    method: "open",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.NONE,
      format: "A4",
      orientation: "landscape",
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
        background: true, // Aumenta a chance de capturar o fundo
      },
      canvas: {
        useCORS: true,
      },
    },
  } as any;

  const getTargetElement = () => {
    const element = document.getElementById("content-id");

    if (element) {
      element.style.width = "1200px";
      element.style.height = "847px";
    }

    return element;
  };

  const handleGeneratePDF = () => {
    generatePDF(getTargetElement, options);
    window.alert("Iniciando o download. Aguarde alguns segudos!");
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
    if (rodadas === currentRodada) {
      const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
      setLeaderBoard((prevState) => [sortedPlayers, ...prevState]);
      setEndGame(true);
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
            <div className="flex w-full gap-2">
              <Button
                onClick={() => handleClick(players.length)}
                className="w-full"
              >
                {rodadas === currentRodada
                  ? "Finalizar partida"
                  : "Gerar próximo"}
              </Button>
              {currentRodada > 0 && (
                <Button onClick={reset} className="w-full">
                  Reiniciar jogo
                </Button>
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
    let increment = 0;
    let index = Math.floor(Math.random() * 99);
    let newThemes: string[] = [];

    while (increment !== quantity) {
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
        <>
          <StartArea setStart={setStart} />
        </>
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
              Rodada:{currentRodada > rodadas ? rodadas : currentRodada}/
              {rodadas}
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
                        <SelectContent
                          ref={(ref) => {
                            if (!ref) return;
                            ref.ontouchstart = (e) => {
                              e.preventDefault();
                            };
                          }}
                        >
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
                        <SelectContent
                          ref={(ref) => {
                            if (!ref) return;
                            ref.ontouchstart = (e) => {
                              e.preventDefault();
                            };
                          }}
                        >
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
                        <SelectContent
                          ref={(ref) => {
                            if (!ref) return;
                            ref.ontouchstart = (e) => {
                              e.preventDefault();
                            };
                          }}
                        >
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                        </SelectContent>
                      </Select>

                      <Separator />

                      <div className="w-full flex gap-2">
                        <Button
                          className="flex gap-4 w-full"
                          onClick={() =>
                            setIsDarkMode((prevState) => !prevState)
                          }
                        >
                          {theme === "light" ? (
                            <>
                              <BedtimeOutlinedIcon
                                sx={{
                                  width: "20px !important",
                                  height: "20px !important",
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <WbSunnyOutlinedIcon />
                            </>
                          )}
                        </Button>

                        <Button
                          className="flex gap-4"
                          onClick={handleOpenTemplate}
                        >
                          Gerar template
                        </Button>
                      </div>

                      <Button
                        className="flex gap-4"
                        onClick={() => {
                          const cleanPlayer = players.map((player) => {
                            return {
                              name: "",
                              points: player.points,
                              currentPoints: player.currentPoints,
                              data: player.data,
                              id: player.id,
                            };
                          });
                          setPlayers(cleanPlayer);
                        }}
                      >
                        <PersonOffOutlinedIcon /> Limpar nome dos jogadores
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
            {currentRodada === 0 && (
              <img src={logo} alt="Logo Adedonha" className="h-24 w-24" />
            )}
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
                    <img src={stopAlert} alt="alert" />
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    PAREM AS CANETAS! <br /> ACABOU O TEMPO
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
                    className={`${
                      theme === "dark" && "text-white"
                    } text-2xl font-semibold text-center`}
                  >
                    Jogos Anteriores
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="p-2 ">
                      {paginationLeaderBoard[currentPaginatinationPage] !==
                      undefined ? (
                        paginationLeaderBoard[currentPaginatinationPage].map(
                          (round, roundIndex) => (
                            <div
                              key={roundIndex}
                              className="bg-muted rounded-md p-4 mb-4 drop-shadow-2xl hover:shadow-xl transition-shadow"
                            >
                              <ul
                                className="space-y-2 min-h-fit max-h-[190px] overflow-hidden overflow-y-auto"
                                style={{ WebkitOverflowScrolling: "touch" }}
                              >
                                {" "}
                                {round.map((player: PlayerProps, index) => (
                                  <div key={index}>
                                    {index === 0 && (
                                      <div className="flex gap-2 justify-between items-center">
                                        <p className="text-sm font-bold text-blue-500 mb-3">
                                          Jogo: <br />
                                          {player.data} a
                                        </p>

                                        <Button
                                          variant={"ghost"}
                                          onClick={() => {
                                            setDetails({
                                              state: true,
                                              match: round,
                                            });
                                            setLeaderBoardModal(false);
                                          }}
                                        >
                                          <ShareOutlinedIcon />
                                        </Button>
                                      </div>
                                    )}

                                    <li
                                      key={
                                        player.id ||
                                        `${player.name}-${roundIndex}`
                                      }
                                      className={`flex justify-between items-center p-2 rounded-md transition-colors ${
                                        theme === "dark"
                                          ? "bg-white"
                                          : "bg-gray-200"
                                      }`}
                                    >
                                      <span className="text-gray-800 font-medium">
                                        {player.name}
                                      </span>
                                      <span className="text-green-500 font-bold">
                                        {player.points}
                                      </span>
                                    </li>
                                  </div>
                                ))}
                              </ul>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-center text-gray-500">
                          Sem dados anteriores
                        </p>
                      )}
                    </div>

                    {currentPaginatinationPage >= 0 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              className={
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
                              {currentPaginatinationPage + 1}
                            </PaginationLink>
                          </PaginationItem>

                          {currentPaginatinationPage !==
                            paginationLeaderBoard.length && (
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                className={
                                  currentPaginatinationPage >
                                  Math.ceil(leaderBoard.length / 2) - 2
                                    ? "pointer-events-none opacity-50"
                                    : undefined
                                }
                                onClick={() =>
                                  setCurrentPaginationPage(
                                    (prevState) => prevState + 1
                                  )
                                }
                              >
                                {currentPaginatinationPage + 2}
                              </PaginationLink>
                            </PaginationItem>
                          )}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              className={
                                currentPaginatinationPage >
                                Math.ceil(leaderBoard.length / 2) - 2
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
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex gap-2">
                  <Button
                    className="w-full flex gap-2"
                    variant={"destructive"}
                    onClick={() => {
                      localStorage.removeItem("leaderboard");
                      setPaginationLeaderBoard([]);
                      setCurrentPaginationPage(0);
                      setLeaderBoard([]);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon />
                    Limpar historico
                  </Button>
                  <Button
                    className="w-full flex gap-2"
                    onClick={() => setLeaderBoardModal(false)}
                  >
                    <ClearOutlinedIcon /> Fechar
                  </Button>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={template.state}
              onOpenChange={handleOpenTemplate}
            >
              <AlertDialogContent className="w-[90%] rounded-lg md:rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className={`${
                      theme === "dark" && "text-white"
                    } text-2xl font-semibold text-center`}
                  >
                    Gerar template
                  </AlertDialogTitle>
                  <AlertDialogDescription className="w-full">
                    {template.open ? (
                      <>
                        <div className="w-[300px] absolute top-[-9999px]">
                          <TemplateBoard
                            temas={template.temas}
                            callbackPDF={handleGeneratePDF}
                          />
                        </div>

                        <div className="flex flex-col justify-center items-center gap-2">
                          <img
                            src={logo}
                            alt="Logo Adedonha"
                            className="h-24 w-24"
                          />

                          <h1>
                            Sua template foi gerada com sucesso! Baixe agora,
                            imprima e se divirta!
                          </h1>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p>
                          Digite os temas para gerar a template, separados por
                          virgula. Gere facilmente uma ficha para jogar!
                          <br />
                        </p>
                        <Input
                          className="w-full"
                          value={currentSelectedTemas}
                          onChange={(e) => {
                            setCurrentSelectedTemas(e.target.value);
                            e.target.value = "";
                          }}
                        />
                        <p className="text-xs">
                          *Recomendamos templates com no máximo 9 temas.
                        </p>
                      </div>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex gap-2">
                  {template.open ? (
                    <>
                      <Button onClick={handleGeneratePDF} variant={"secondary"}>
                        <PictureAsPdfOutlinedIcon /> Download template
                      </Button>
                      <Button
                        className={`w-full flex gap-2 `}
                        onClick={() =>
                          setTemplate({
                            state: false,
                            temas: [],
                            open: false,
                          })
                        }
                      >
                        <ClearOutlinedIcon /> Fechar
                      </Button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Button
                        className="w-full flex gap-2"
                        variant={"default"}
                        onClick={() => {
                          const splitVirgula = currentSelectedTemas
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");
                          console.log(splitVirgula);
                          setTemplate((prevState) => ({
                            ...prevState,
                            temas: [...prevState.temas, ...splitVirgula],
                            open: true,
                          }));
                          setCurrentSelectedTemas("");
                        }}
                      >
                        <SaveOutlinedIcon />
                        Salvar
                      </Button>
                      <Button
                        className="w-full flex gap-2"
                        variant={"secondary"}
                        onClick={() =>
                          setTemplate({
                            state: false,
                            temas: [],
                            open: false,
                          })
                        }
                      >
                        <ClearOutlinedIcon /> Fechar
                      </Button>
                    </>
                  )}
                </div>
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

            <AlertDialog
              open={historyLetter.length === rodadas + 1 || details.state}
              onOpenChange={setAlert}
            >
              <AlertDialogContent className="w-[95%] rounded-lg md:rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className={`${theme === "dark" && "text-white"}`}
                  >
                    {!details.state ? "Fim de jogo" : "Detalhes da partida"}
                  </AlertDialogTitle>
                  <Separator />
                  <AlertDialogDescription
                    className={`flex flex-col gap-3 ${
                      theme === "dark" && "text-white"
                    }`}
                  >
                    {!details.state && `${rodadas} rodadas atigidas`}
                    <LeaderboardImage
                      data={!details.state ? leaderBoard[0] : details.match}
                      onClose={
                        !details.state
                          ? undefined
                          : () => {
                              setDetails({
                                state: false,
                                match: [],
                              });
                              setLeaderBoardModal(true);
                            }
                      }
                      onReset={reset}
                    />
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
