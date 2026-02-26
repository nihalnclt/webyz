import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import { useMainGraph } from "../hooks/useOverview";
import { format, parseISO } from "date-fns";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
);

function MainGraph() {
  const { data, isLoading } = useMainGraph();

  const labels = data?.data?.labels.map((d) => {
    const iso = d.replace(" ", "T"); // fix for parseISO
    return format(parseISO(iso), "HH:mm");
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: data?.data?.metric,
        data: data?.data?.plot,
        borderColor: "#f26c6d",
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(242,108,109,0.4)");
          gradient.addColorStop(1, "rgba(242,108,109,0.02)");
          return gradient;
        },
      },

      // comparison graph (if exists)
      ...(data?.data?.comparison_plot
        ? [
            {
              label: "Previous",
              data: data?.data?.comparison_plot,
              borderColor: "#94a3b8",
              pointRadius: 0,
              tension: 0.4,
              borderDash: [5, 5],
              fill: false,
            },
          ]
        : []),
    ],
  };

  const options: any = {
    plugins: {
      legend: false,
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: { color: "#eee" },
        beginAtZero: true,
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default MainGraph;
