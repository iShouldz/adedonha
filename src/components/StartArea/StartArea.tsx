import { useTheme } from "../theme-provider";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { startAreaProps } from "@/interfaces/start";
import stop from "../../assets/stop.png";

const StartArea = ({ setStart }: startAreaProps) => {
  const { theme } = useTheme();
  return (
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
        <p
          className={`font-extrabold tracking-tight text-xl ${
            theme === "dark" && "text-white"
          }`}
        >
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
  );
};

export default StartArea;
