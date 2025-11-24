import { useState } from "react";
import { useTransactions } from "../context/TransactionsContext";
import api from "../services/api";


export default function ImportarCSV() {
  const { refreshTransactions } = useTransactions();
  const [arquivo, setArquivo] = useState(null);

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo) return;

    const formData = new FormData();
    formData.append("file", arquivo);

    try {
      await api.post("/transactions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen lg:max-h-screen p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 text-white">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Importar CSV</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-6">
        <div className="$1">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 font-semibold">Selecione o arquivo CSV</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-white file:bg-white/20 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 file:cursor-pointer cursor-pointer"
                />
              </div>

              {arquivo && (
                <p className="text-sm opacity-80">Arquivo selecionado: {arquivo.name}</p>
              )}

              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-lg shadow-lg">
                Importar
              </button>
            </form>
          </div>
        </div>

        <div className="$1">
          <div>
            <h3 className="text-lg font-bold mb-2">Instruções do CSV</h3>
            <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
              <li>O arquivo deve estar no formato CSV.</li>
              <li>Certifique-se de que as colunas estejam corretas.</li>
              <li>Após o envio, as transações serão processadas.</li>
            </ul>
            <div className="mt-4 bg-white/20 p-3 rounded-xl text-sm">
              <p className="font-semibold mb-2">Formato obrigatório:</p>
              <pre className="whitespace-pre-wrap">date,title,amount</pre>
              <p className="font-semibold mt-4 mb-1">Exemplo:</p>
              <pre className="whitespace-pre-wrap">2025-01-10,Padaria,12.50
2025-01-12,Supermercado,89.90</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
