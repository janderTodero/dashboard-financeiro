export const chartAnimation = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1200,
    easing: "easeOutQuart",
    delay: (context) => context.dataIndex * 100,
  },
  plugins: {
    legend: {
      labels: {
        color: "#e2e8f0",
        usePointStyle: true,
        font: { size: 12 },
      },
      position: "bottom",
    },
  },
};

export const lineOptions = {
  ...chartAnimation,
  elements: {
    line: { tension: 0.3 },
    point: { radius: 4, hoverRadius: 6 },
  },
};

export const barOptions = {
  ...chartAnimation,
  scales: {
    x: { ticks: { color: "#e2e8f0" } },
    y: { ticks: { color: "#e2e8f0" } },
  },
};

export const doughnutOptions = {
  ...chartAnimation,
  plugins: {
    ...chartAnimation.plugins,
    legend: {
      ...chartAnimation.plugins.legend,
      position: "bottom",
    },
  },
};