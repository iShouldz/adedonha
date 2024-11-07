import logo from "../../assets/logo.png";
import { toPng } from "html-to-image";
import { useCallback, useRef } from "react";
import download from "downloadjs";
import { Button } from "../ui/button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerLeaderboard } from "@/interfaces/player";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

const LeaderboardImage = ({ data, onReset }: PlayerLeaderboard) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(async () => {
    if (ref.current) {
      download(await toPng(ref.current), "leaderboard.png");
    }
  }, [ref?.current]);

  //   const positions = [
  //     { icon: "🥇", color: "text-yellow-500" },
  //     { icon: "🥈", color: "text-gray-500" },
  //   ];
  return (
    <div className="flex flex-col gap-2">
      <div
        className="bg-white shadow-2xl rounded-lg p-6 w-80 text-center"
        ref={ref}
      >
        <div className="flex flex-col justify-center items-center">
          <img src={logo} alt="Logo Adedonha" className="h-24 w-24" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Leaderboard
          </h2>
        </div>

        {/* {data.slice(0, 2).map((player, index) => (
          <div key={index} className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-center py-2">
              <span className={`font-bold ${positions[index].color} text-lg`}>
                {positions[index].icon} {index + 1}º
              </span>
              <span className="text-gray-700 flex-grow text-left ml-3">
                {player.name}
              </span>
              <span className="font-semibold text-green-500">
                {player.points}
              </span>
            </div>
          </div>
        ))}

        {data[2] !== undefined && (
          <div className="py-4">
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-yellow-700 text-lg">🥉 3º</span>
              <span className="text-gray-700 flex-grow text-left ml-3">
                Jogador 3
              </span>
              <span className="font-semibold text-green-500">1000 pts</span>
            </div>
          </div>
        )} */}
        <div className="flex items-end justify-center space-x-4 py-6">
          <div className="flex flex-col items-center space-y-2">
            <span className="font-bold text-gray-500 text-lg">🥈 2º</span>
            <div className="bg-gray-400 text-gray-700 p-4 w-20 h-32 rounded-md flex flex-col items-center justify-center">
              <Avatar>
                <AvatarImage
                  src={`https://robohash.org/${data[1].name}.png?set=set4`}
                />
                <AvatarFallback>{data[1].name[0]}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{data[1].name}</p>
              <p className="text-green-300 font-bold">{data[1].points}</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <span className="font-bold text-yellow-500 text-xl">🥇 1º</span>
            <div className="bg-yellow-400 text-gray-700 p-4 w-24 h-40 rounded-md flex flex-col items-center justify-center shadow-lg">
              <Avatar>
                <AvatarImage
                  src={`https://robohash.org/${data[0].name}.png?set=set4`}
                />
                <AvatarFallback>{data[0].name[0]}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{data[0].name}</p>
              <p className="text-green-500 font-bold">{data[0].points}</p>
            </div>
          </div>
          {data[2] !== undefined && (
            <div className="flex flex-col items-center space-y-2">
              <span className="font-bold text-yellow-800 text-lg">🥉 3º</span>
              <div className="bg-yellow-600 text-gray-700 p-4 w-20 h-28 rounded-md flex flex-col items-center justify-center">
                <Avatar>
                  <AvatarImage
                    src={`https://robohash.org/${data[2].name}.png?set=set4`}
                  />
                  <AvatarFallback>{data[2].name[0]}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{data[2].name}</p>
                <p className="text-green-500 font-bold">{data[2].points}</p>
              </div>
            </div>
          )}
        </div>
        <footer className="mt-6 text-gray-600 text-sm">
          Divirta-se:{" "}
          <a
            href="https://adedonha.vercel.app"
            className="text-blue-500 hover:underline"
          >
            https://adedonha.vercel.app
          </a>
        </footer>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button onClick={() => handleClick()}>
          <FileDownloadOutlinedIcon
            sx={{ width: "24px !important", height: "24px !important" }}
          />{" "}
          Baixar
        </Button>
        <Button onClick={onReset} variant={"destructive"}>
          <ReplayOutlinedIcon
            sx={{ width: "24px !important", height: "24px !important" }}
          />{" "}
          Reiniciar
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardImage;
