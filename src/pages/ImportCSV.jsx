import { useState } from "react";
import { useTransactions } from "../context/TransactionsContext";
import api from "../services/api";
import { UploadCloud, FileText, Info, CheckCircle, AlertTriangle, X } from "lucide-react";

export default function ImportarCSV() {
  const { refreshTransactions } = useTransactions();
  const [arquivo, setArquivo] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
      setStatus({ type: "", message: "" });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        setArquivo(file);
        setStatus({ type: "", message: "" });
      } else {
        setStatus({ type: "error", message: "Por favor, envie apenas arquivos CSV." });
      }
    }
  };

  const removeFile = () => {
    setArquivo(null);
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", arquivo);

    try {
      await api.post("/transactions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshTransactions();
      setStatus({ type: "success", message: "Importação realizada com sucesso!" });
      setArquivo(null);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Erro ao importar o arquivo. Verifique o formato." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 text-white">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left flex items-center gap-3">
          <UploadCloud className="w-8 h-8" />
          Importar Fatura
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área de Upload */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-2xl shadow-xl p-6 md:p-8 h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Upload de Arquivo
              </h3>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col" onDragEnter={handleDrag}>
                <div
                  className={`relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 min-h-[300px]
                    ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/50"}
                    ${arquivo ? "border-green-500/50 bg-green-500/5" : ""}
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={loading}
                  />

                  {!arquivo ? (
                    <div className="text-center p-6 pointer-events-none">
                      <div className="bg-zinc-800 p-4 rounded-full inline-flex mb-4">
                        <UploadCloud className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-200 mb-2">
                        Arraste e solte seu arquivo CSV aqui
                      </p>
                      <p className="text-sm text-gray-400">
                        ou clique para selecionar do computador
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-6 z-20">
                      <div className="bg-green-500/20 p-4 rounded-full mb-4">
                        <FileText className="w-10 h-10 text-green-400" />
                      </div>
                      <p className="text-lg font-medium text-white mb-1">{arquivo.name}</p>
                      <p className="text-sm text-gray-400 mb-6">
                        {(arquivo.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <X className="w-4 h-4" /> Remover arquivo
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Messages */}
                {status.message && (
                  <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                    }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <p>{status.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!arquivo || loading}
                  className={`cursor-pointer mt-6 w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
                    ${!arquivo || loading
                      ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25"}
                  `}
                >
                  {loading ? "Processando..." : "Importar Transações"}
                </button>
              </form>
            </div>
          </div>

          {/* Instruções */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-2xl shadow-xl p-6 md:p-8 h-full">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-400" />
                Instruções
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">Requisitos do Arquivo</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-blue-500" />
                      O arquivo deve estar obrigatoriamente no formato .CSV
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-blue-500" />
                      Use vírgula (,) como separador
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-blue-500" />
                      Não inclua cabeçalhos ou linhas em branco extras
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Formato das Colunas
                  </p>
                  <code className="block font-mono text-sm text-blue-300 mb-4 bg-zinc-950/50 p-2 rounded">
                    date,title,amount
                  </code>

                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Exemplo de Conteúdo
                  </p>
                  <div className="font-mono text-xs text-gray-300 bg-zinc-950/50 p-3 rounded-lg overflow-x-auto">
                    2025-01-10,Padaria,12.50<br />
                    2025-01-12,Salário,5000.00<br />
                    2025-01-15,Internet,89.90
                  </div>
                </div>

                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                      Certifique-se de que os valores decimais usem ponto (.) e não vírgula. As datas devem seguir o padrão AAAA-MM-DD.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
