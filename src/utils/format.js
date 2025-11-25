export default function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseDate(dateString) {
  if (!dateString) return new Date();

  // Handle ISO strings (e.g., 2023-10-26T14:00:00.000Z)
  // We only care about the date part YYYY-MM-DD
  const cleanDateString = dateString.split("T")[0];

  const [year, month, day] = cleanDateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}