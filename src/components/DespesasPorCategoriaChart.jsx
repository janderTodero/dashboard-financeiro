import { Doughnut } from "react-chartjs-2";
import EmptyMessage from "./EmptyMesage";


export default function DespesasPorCategoriaChart({ data, options }) {
  if (!data || !data.labels || data.labels.length === 0) {
    return <EmptyMessage>Nenhuma despesa registrada</EmptyMessage>;
  }
  return <Doughnut data={data} options={options} />;
}