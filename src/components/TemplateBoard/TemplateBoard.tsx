import { TemplateThemes } from "@/interfaces/player";
import logo from "../../assets/logo.png";

const TemplateBoard = ({ temas, callbackPDF }: TemplateThemes) => {
  return (
    <div>
      <button onClick={callbackPDF}>Generate PDF</button>
      <div
        id="content-id"
        className="w-screen h-screen overflow-auto p-2 bg-white shadow-lg flex-1"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "150px",
          opacity: 0.5,
        }}
      >
        <table className="min-w-full h-full bg-transparent rounded-lg shadow-lg">
          <thead className="p-6">
            <tr className="flex items-center justify-center">
              {temas.map((item) => (
                <th
                  key={item}
                  className="py-4 px-10 border-b-2 flex items-center justify-center text-left font-semibold text-gray-600 border-r-2"
                >
                  {item}
                </th>
              ))}
              <th className="py-4 px-10 border-b-2 text-left font-semibold text-gray-600 border-r-2">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="w-full">
            {(() => {
              let rows = [];
              for (let i = 0; i < 16; i++) {
                rows.push(
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-6 px-6"></td>
                  </tr>
                );
              }
              return rows;
            })()}
          </tbody>
        </table>

        <div className="absolute z-10 bottom-1 w-full flex justify-center">
          <div className="flex flex-col justify-end items-center">
            <footer className="w-full pb-4">
              <div className="flex flex-col justify-end space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold">Adedonha</span>
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
