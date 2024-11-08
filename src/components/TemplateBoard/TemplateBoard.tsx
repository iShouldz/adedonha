import { TemplateThemes } from "@/interfaces/player";
import logo from "../../assets/logo.png";
import dayjs from "dayjs";

const TemplateBoard = ({ temas, callbackPDF }: TemplateThemes) => {
  return (
    <div>
      <button onClick={callbackPDF}>Generate PDF</button>
      <div
        id="content-id"
        className="w-screen h-screen overflow-auto p-2 bg-transparent shadow-lg flex-1"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "150px",
          opacity: 0.5,
        }}
      >
        <table className="table-fixed w-full h-full bg-transparent rounded-lg shadow-lg">
          <thead className="p-6 w-full">
            <tr>
              {temas.map((item) => (
                <th
                  key={item}
                  className="w-1/6 py-4 px-8 border-b-2 text-center font-semibold text-gray-600 border-r-2"
                >
                  {item.charAt(0).toLocaleUpperCase() + item.slice(1)}
                </th>
              ))}
              <th className="w-1/6 py-4 px-10 border-b-2 text-center font-semibold text-gray-600 border-r-2">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="w-full">
            {(() => {
              let rows = [];
              for (let i = 0; i < 17; i++) {
                rows.push(
                  <tr key={i} className="border-b">
                    <td className="py-6 px-6"></td>
                  </tr>
                );
              }
              return rows;
            })()}
          </tbody>
        </table>

        <div className="absolute z-10 bottom-2 w-full flex justify-center">
          <div className="flex flex-col justify-end items-center">
            <footer className="w-full pb-4">
              <div className="flex flex-col justify-end space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold">
                    Jogo: {dayjs(dayjs()).format("DD/MM/YYYY - HH:mm")}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2 text-center">
                  © 2024 Adedonha. Todos os direitos reservados.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBoard;
