import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { letras } from "./utils/const.utils";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
    if (timeLeft === 0) {
      setAlert(true);
    }
  }, [timeLeft]);

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

  return (
    <div className="max-sm:bg-[#ced6dc] h-[100vh] max-sm:p-5">
      {!start ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Adedonha
          </h1>
          <img src={stop} />
          <Button onClick={() => setStart((prevState) => !prevState)}>
            Start
          </Button>
        </div>
      ) : historyLetter.length === rodadas + 1 ? (
        <AlertDialog open={true} onOpenChange={setAlert}>
          <AlertDialogContent className="w-3/4 rounded-lg md:rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Fim de jogo</AlertDialogTitle>
              <AlertDialogDescription>
                {rodadas} atigidas
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
              <SheetTitle>
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
                    <p>Selecione o timer da rodada</p>

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
                        <SelectItem value="3">3 rodadas</SelectItem>
                        <SelectItem value="5">5 rodadas</SelectItem>
                        <SelectItem value="7">7 rodadas</SelectItem>
                      </SelectContent>
                    </Select>

                    <Separator />
                    <p>Selecione o número de rodadas</p>

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
                  </ToggleGroup>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <section className="w-full h-full flex flex-col justify-center items-center gap-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Adedonha
            </h1>

            <ToggleGroup
              type="single"
              variant="outline"
              className="flex flex-wrap w-full  gap-2"
            >
              <ToggleGroupItem
                key={"letter"}
                value="valor"
                aria-label="Toggle bold"
              >
                {randomLetter}
              </ToggleGroupItem>
            </ToggleGroup>
            <h1></h1>

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
                <CardTitle>Letras que já sairam:</CardTitle>
                <CardDescription>
                  {timeLeft > 0 && (
                    <>
                      <h2>Contagem Regressiva: {timeLeft} segundos</h2>
                      <Progress value={timeLeft} />
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
              </CardContent>
              <CardFooter className="flex gap-2 w-full justify-center">
                <Button
                  onClick={getRandomLetter}
                  disabled={historyLetter.length === 25 || timeLeft > 0}
                >
                  Gerar aleatorio
                </Button>
                <Button onClick={reset}>Reiniciar jogo</Button>
              </CardFooter>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
