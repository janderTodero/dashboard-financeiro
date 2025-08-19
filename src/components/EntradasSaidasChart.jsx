import { Bar } from "react-chartjs-2";
import EmptyMessage from "./EmptyMesage";

export default function EntradasSaidasChart({ data, options }) {
  if (!data || !data.labels || data.labels.length === 0) {
    return <EmptyMessage>Sem dados de entradas/saídas</EmptyMessage>;
  }
  return <Bar data={data} options={options} />;
}