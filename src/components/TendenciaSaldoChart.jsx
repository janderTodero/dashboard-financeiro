import { Line } from "react-chartjs-2";
import EmptyMessage from "./EmptyMesage";

export default function TendenciaSaldoChart({ data, options }) {
  if (!data || !data.labels || data.labels.length === 0) {
    return <EmptyMessage>Sem dados de saldo</EmptyMessage>;
  }
  return <Line data={data} options={options} />;
}